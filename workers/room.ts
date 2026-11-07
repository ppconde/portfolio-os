import { DurableObject } from 'cloudflare:workers';
import { z } from 'zod';
import {
  isLegal,
  newBoard,
  pickMove,
  resultText,
  type Seat,
  sow,
} from '../app/mancala';
import {
  COLORS,
  isBlocked,
  isNear,
  type Player,
  type ServerMsg,
  SPAWN,
  TABLES,
  type TableState,
} from '../app/room';

const SEAT_HOLD_MS = 30_000; // a player who drops mid-game gets this long to reconnect
const RESULT_MS = 5_000; // how long "Blu wins 28–20" shows before the table resets
// A seat abandoned mid-game: 'ai' = the server plays it out, 'forfeit' = the other player wins.
const ABANDON: 'ai' | 'forfeit' = 'forfeit';

const seatSchema = z.union([z.literal(0), z.literal(1)]);
const ClientMsg = z.discriminatedUnion('t', [
  z.object({ t: z.literal('pos'), x: z.int(), y: z.int() }),
  z.object({ t: z.literal('say'), text: z.string().trim().min(1).max(80) }),
  z.object({ t: z.literal('sit'), tableId: z.int(), seat: seatSchema }),
  z.object({ t: z.literal('stand') }),
  z.object({
    t: z.literal('move'),
    tableId: z.int(),
    pit: z.int(),
    version: z.int(),
  }),
]);

const fresh = (t: TableState) => {
  t.board = newBoard();
  t.turn = 0;
  t.version++;
};
const inGame = (t: TableState) => !!(t.seats[0] && t.seats[1] && !t.result);

// The Book Room: everyone's avatar (in each socket's attachment, so it survives
// hibernation) and the three Mancala tables (in SQLite).
export class Room extends DurableObject<Env> {
  tables: TableState[];

  constructor(ctx: DurableObjectState, env: Env) {
    super(ctx, env);
    const sql = ctx.storage.sql;
    sql.exec(`CREATE TABLE IF NOT EXISTS tables (
      id INTEGER PRIMARY KEY, seats TEXT, board TEXT, turn INTEGER,
      version INTEGER, result TEXT, result_until INTEGER)`);
    const rows = sql.exec('SELECT * FROM tables ORDER BY id').toArray();
    this.tables = TABLES.map(({ id }) => {
      const r = rows.find((row) => row.id === id);
      if (r)
        return {
          id,
          seats: JSON.parse(r.seats as string),
          board: JSON.parse(r.board as string),
          turn: r.turn as Seat,
          version: r.version as number,
          result: r.result as string | null,
          resultUntil: r.result_until as number | null,
        };
      const t: TableState = {
        id,
        seats: [null, null],
        board: newBoard(),
        turn: 0,
        version: 0,
        result: null,
        resultUntil: null,
      };
      this.save(t);
      return t;
    });
  }

  save(t: TableState) {
    this.ctx.storage.sql.exec(
      'INSERT OR REPLACE INTO tables VALUES (?, ?, ?, ?, ?, ?, ?)',
      t.id,
      JSON.stringify(t.seats),
      JSON.stringify(t.board),
      t.turn,
      t.version,
      t.result,
      t.resultUntil
    );
    // One alarm for the soonest deadline: a held seat or a result to clear.
    const due = this.tables
      ?.flatMap((x) => [x.resultUntil, x.seats[0]?.away, x.seats[1]?.away])
      .filter((d): d is number => !!d);
    if (!due?.length) return void this.ctx.storage.deleteAlarm();
    this.ctx.storage.setAlarm(Math.min(...due));
  }

  broadcast(msg: ServerMsg, except?: WebSocket) {
    const data = JSON.stringify(msg);
    for (const ws of this.ctx.getWebSockets())
      if (ws !== except)
        try {
          ws.send(data);
        } catch {} // already closing
  }

  emit(t: 'seated' | 'stood' | 'gameOver' | 'tableReset', table: TableState) {
    this.save(table);
    this.broadcast({ t, table });
  }

  players() {
    const byId = new Map<string, Player>();
    for (const ws of this.ctx.getWebSockets()) {
      const p = ws.deserializeAttachment() as Player | null;
      if (p) byId.set(p.id, p);
    }
    return [...byId.values()];
  }

  seatOf(id: string) {
    for (const t of this.tables) {
      const seat = t.seats.findIndex((s) => s?.id === id);
      if (seat >= 0) return { t, seat: seat as Seat };
    }
  }

  async fetch(request: Request) {
    const url = new URL(request.url);
    const id = url.searchParams.get('id') ?? '';
    if (!/^[\w-]{8,64}$/.test(id))
      return new Response('Bad id', { status: 400 });
    const name =
      (url.searchParams.get('name') ?? '')
        .replace(/[^\p{L}\p{N} _.-]/gu, '')
        .trim()
        .slice(0, 16) || 'Guest';
    const color = url.searchParams.get('color') ?? '';

    // Same player again (reload, second tab): the newest socket wins.
    const old = this.ctx.getWebSockets(id)[0];
    const oldPlayer = old?.deserializeAttachment() as Player | undefined;
    for (const ws of this.ctx.getWebSockets(id)) ws.close(4000, 'Replaced');

    const seated = this.seatOf(id);
    const at = seated
      ? TABLES[seated.t.id].seats[seated.seat]
      : (oldPlayer ?? SPAWN);
    const player: Player = {
      id,
      name,
      color: COLORS.includes(color) ? color : COLORS[0],
      x: at.x,
      y: at.y,
    };
    const [client, server] = Object.values(new WebSocketPair());
    this.ctx.acceptWebSocket(server, [id]);
    server.serializeAttachment(player);

    // Back within the hold: take the seat again.
    const seat = seated?.t.seats[seated.seat];
    if (seated && seat?.away) {
      delete seat.away;
      this.emit('seated', seated.t);
    }
    server.send(
      JSON.stringify({
        t: 'snapshot',
        you: id,
        players: this.players(),
        tables: this.tables,
      } satisfies ServerMsg)
    );
    this.broadcast({ t: 'joined', player }, server);
    return new Response(null, { status: 101, webSocket: client });
  }

  async webSocketMessage(ws: WebSocket, raw: string | ArrayBuffer) {
    let data: unknown;
    try {
      data = JSON.parse(raw as string);
    } catch {
      return;
    }
    const parsed = ClientMsg.safeParse(data);
    if (!parsed.success) return;
    const msg = parsed.data;
    const me = ws.deserializeAttachment() as Player;
    const send = (m: ServerMsg) => ws.send(JSON.stringify(m));

    switch (msg.t) {
      case 'pos': {
        // One tile at a time, on the floor, and never while seated.
        const step = Math.abs(msg.x - me.x) + Math.abs(msg.y - me.y);
        if (this.seatOf(me.id) || step !== 1 || isBlocked(msg))
          return send({ t: 'pos', id: me.id, x: me.x, y: me.y });
        ws.serializeAttachment({ ...me, x: msg.x, y: msg.y });
        return this.broadcast({ t: 'pos', id: me.id, x: msg.x, y: msg.y }, ws);
      }
      case 'say':
        return this.broadcast({ t: 'say', id: me.id, text: msg.text });
      case 'sit': {
        const t = this.tables[msg.tableId];
        const spot = TABLES[msg.tableId]?.seats[msg.seat];
        if (!t || t.seats[msg.seat] || this.seatOf(me.id) || !isNear(me, spot))
          return;
        t.seats[msg.seat] = { id: me.id, name: me.name };
        if (inGame(t)) fresh(t);
        ws.serializeAttachment({ ...me, ...spot });
        this.broadcast({ t: 'pos', id: me.id, ...spot });
        return this.emit('seated', t);
      }
      case 'stand':
        return this.leave(me.id, false);
      case 'move': {
        const t = this.tables[msg.tableId];
        const seat = t?.seats.findIndex((s) => s?.id === me.id) as Seat;
        if (
          !t ||
          !inGame(t) ||
          t.turn !== seat ||
          t.version !== msg.version ||
          !isLegal(t.board, seat, msg.pit)
        )
          return;
        return this.play(t, seat, msg.pit);
      }
    }
  }

  play(t: TableState, seat: Seat, pit: number) {
    const r = sow(t.board, seat, pit);
    t.board = r.board;
    t.turn = r.turn;
    t.version++;
    this.save(t);
    this.broadcast({ t: 'moveApplied', table: t, seat, pit });
    if (r.over) {
      const names = t.seats.map((s) => s?.name ?? '?') as [string, string];
      return this.finish(t, resultText(t.board, names));
    }
    const next = t.seats[t.turn];
    if (next?.ai) this.play(t, t.turn, pickMove(t.board, t.turn));
  }

  finish(t: TableState, result: string) {
    t.result = result;
    t.resultUntil = Date.now() + RESULT_MS;
    this.emit('gameOver', t);
  }

  // `id` leaves their seat: on purpose, or by dropping (seat held mid-game).
  leave(id: string, dropped: boolean) {
    const found = this.seatOf(id);
    if (!found) return;
    const { t, seat } = found;
    const s = t.seats[seat];
    if (!s) return;
    if (inGame(t) && dropped) {
      s.away = Date.now() + SEAT_HOLD_MS;
      return this.emit('seated', t);
    }
    if (inGame(t)) return this.abandon(t, seat);
    t.seats[seat] = null;
    this.emit('stood', t);
  }

  abandon(t: TableState, seat: Seat) {
    const other = t.seats[1 - seat];
    if (ABANDON === 'forfeit' || !other || other.ai) {
      t.seats[seat] = null;
      if (!other || other.away || other.ai) return this.reset(t);
      return this.finish(t, `${other.name} wins by forfeit`);
    }
    t.seats[seat] = { id: `ai-${t.id}`, name: 'Computer', ai: true };
    this.emit('seated', t);
    if (t.turn === seat) this.play(t, seat, pickMove(t.board, seat));
  }

  // New board; the AI and anyone still away leave; two seated players rematch.
  reset(t: TableState) {
    t.seats = t.seats.map((s) => (s && !s.away && !s.ai ? s : null)) as [
      TableState['seats'][0],
      TableState['seats'][1],
    ];
    t.result = t.resultUntil = null;
    fresh(t);
    this.emit('tableReset', t);
  }

  async alarm() {
    const now = Date.now();
    for (const t of this.tables) {
      if (t.resultUntil && t.resultUntil <= now) this.reset(t);
      for (const seat of [0, 1] as const) {
        const s = t.seats[seat];
        if (!s?.away || s.away > now) continue;
        if (inGame(t)) this.abandon(t, seat);
        else {
          t.seats[seat] = null;
          this.emit('stood', t);
        }
      }
    }
  }

  async webSocketClose(ws: WebSocket) {
    const me = ws.deserializeAttachment() as Player | null;
    if (!me) return;
    // Replaced by a newer socket for the same player: not a departure.
    if (this.ctx.getWebSockets(me.id).some((w) => w !== ws)) return;
    this.leave(me.id, true);
    this.broadcast({ t: 'left', id: me.id }, ws);
  }

  async webSocketError(ws: WebSocket) {
    await this.webSocketClose(ws);
  }
}
