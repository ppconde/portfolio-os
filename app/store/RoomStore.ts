import { create } from 'zustand';
import { isOver, newBoard, pickMove, type Seat, sow } from '~/mancala';
import {
  findPath,
  lineClear,
  NAME_TAKEN,
  type Player,
  type SeatInfo,
  type ServerMsg,
  STEP,
  TABLES,
  type TableState,
  type Tile,
} from '~/room';
import type { ClientMsg } from '../../workers/room';

const TICK_MS = 150; // one walking step / one sown stone
export const BUBBLE_MS = 5_000;
const DEMO_PAUSE = 5; // ticks between demo moves

type RoomStore = {
  status: 'idle' | 'connecting' | 'open' | 'closed';
  you: string | null;
  players: Record<string, Blob>;
  bubbles: Record<string, { text: string; at: number }>;
  tables: TableState[]; // the server's truth
  display: number[][]; // what boards show right now (mid-animation, or the demo)
  sowing: (Seat | null)[]; // whose stones are being sown on each board right now
  viewing: number | null; // the table shown in the board overlay
  now: number;
  muted: boolean; // the taskbar speaker; silences the room's jazz
  nameTaken: boolean; // the last join was refused: someone here has that name
  toggleMute: () => void;
  connect: (name: string, color: string) => void;
  disconnect: () => void;
  send: (msg: ClientMsg) => void;
  walkTo: (to: Tile, sit?: { tableId: number; seat: Seat }) => void;
  view: (tableId: number | null) => void;
};

// A player as drawn: which way they last walked, and when, so eyes can follow.
export type Blob = Player & { look?: Tile; movedAt?: number };

const moveTo = (p: Blob, to: Tile): Blob => {
  const d = Math.hypot(to.x - p.x, to.y - p.y);
  if (!d) return p;
  const look = { x: (to.x - p.x) / d, y: (to.y - p.y) / d };
  return { ...p, x: to.x, y: to.y, look, movedAt: Date.now() };
};

export const seatName = (s: SeatInfo) =>
  s ? `${s.name}${s.ai ? ' (AI)' : ''}${s.away ? ' (away)' : ''}` : '';

export const tableLabel = (t: TableState) => {
  if (t.result) return t.result;
  const [a, b] = t.seats;
  if (a && b) return `${seatName(a)} vs ${seatName(b)}`;
  // Free tables and the waiting Computer go unlabelled.
  return (a || b) && !a?.ai && !b?.ai ? 'Waiting for opponent…' : '';
};

export const mySeat = (t: TableState | undefined, you: string | null) =>
  t ? t.seats.findIndex((s) => s && s.id === you) : -1;

const isEmpty = (t: TableState) => !t.seats[0] && !t.seats[1] && !t.result;

const playerId = () => {
  try {
    const id = sessionStorage.getItem('room-id') ?? crypto.randomUUID();
    sessionStorage.setItem('room-id', id); // survives a reload, so the seat hold works
    return id;
  } catch {
    return crypto.randomUUID();
  }
};

// Module-level, not state: nothing renders from these.
let ws: WebSocket | null = null;
let timer: ReturnType<typeof setInterval> | undefined;
let retry: ReturnType<typeof setTimeout> | undefined;
let route: Tile[] = [];
let pendingSit: { tableId: number; seat: Seat } | null = null;
// Animation steps per table, tagged with the seat sowing them.
const queues: { board: number[]; seat: Seat }[][] = TABLES.map(() => []);
let sowTick = 0; // stones drop every other tick
const demo = TABLES.map(() => ({ turn: 0 as Seat, wait: 0 }));

export const useRoomStore = create<RoomStore>((set, get) => {
  const openBoard = (viewing: number | null) => set({ viewing });

  const onTable = (msg: Extract<ServerMsg, { table: TableState }>) => {
    const { tables, display, you, viewing } = get();
    const old = tables[msg.table.id];
    const t = msg.table;
    const id = t.id;
    if (msg.t === 'moveApplied' && t.version === old.version + 1)
      queues[id].push(
        ...sow(old.board, msg.seat, msg.pit).steps.map((board) => ({
          board,
          seat: msg.seat,
        }))
      );
    else if (msg.t === 'tableReset' || msg.t === 'moveApplied' || isEmpty(old))
      queues[id] = []; // missed a move, new board, or the demo stops: snap
    set({
      tables: tables.map((x) => (x.id === id ? t : x)),
      display: queues[id].length
        ? display
        : display.map((b, i) => (i === id ? t.board : b)),
    });
    const wasMine = mySeat(old, you) >= 0;
    const isMine = mySeat(t, you) >= 0;
    if (isMine && t.seats[0] && t.seats[1] && viewing !== id) openBoard(id);
    // Stood up (Leave, Escape, floor click): the board goes too.
    if (wasMine && !isMine && viewing === id) openBoard(null);
  };

  const onMessage = (msg: ServerMsg) => {
    switch (msg.t) {
      case 'snapshot':
        for (const q of queues) q.length = 0;
        route = [];
        set({
          you: msg.you,
          players: Object.fromEntries(msg.players.map((p) => [p.id, p])),
          tables: msg.tables,
          display: msg.tables.map((t) => t.board),
        });
        for (const t of msg.tables)
          if (mySeat(t, msg.you) >= 0 && t.seats[0] && t.seats[1])
            openBoard(t.id);
        return;
      case 'joined':
        return set((s) => ({
          players: { ...s.players, [msg.player.id]: msg.player },
        }));
      case 'left':
        return set((s) => {
          const { [msg.id]: _, ...players } = s.players;
          return { players };
        });
      case 'pos':
        if (msg.id === get().you) route = []; // the server corrected us
        return set((s) => {
          const p = s.players[msg.id];
          return p
            ? {
                players: { ...s.players, [p.id]: moveTo(p, msg) },
              }
            : s;
        });
      case 'say':
        return set((s) => ({
          bubbles: {
            ...s.bubbles,
            [msg.id]: { text: msg.text, at: Date.now() },
          },
        }));
      default:
        return onTable(msg);
    }
  };

  const tick = () => {
    const s = get();
    // `now` only times bubbles, so whole seconds do: an idle room renders 1x/s, not every tick.
    const now = Math.floor(Date.now() / 1000) * 1000;
    const patch: Partial<RoomStore> = { now };
    const me = s.you && s.players[s.you];
    const target = route[0];
    if (me && target) {
      // Glide toward the next waypoint; CSS smooths between ticks.
      const d = Math.hypot(target.x - me.x, target.y - me.y);
      const k = d <= STEP ? 1 : STEP / d;
      if (k === 1) route.shift();
      const next = {
        x: me.x + (target.x - me.x) * k,
        y: me.y + (target.y - me.y) * k,
      };
      patch.players = { ...s.players, [me.id]: moveTo(me, next) };
      s.send({ t: 'pos', ...next });
    }
    if (me && !target && pendingSit) {
      s.send({ t: 'sit', ...pendingSit });
      pendingSit = null;
    }

    const drop = ++sowTick % 2 === 0;
    const sowing = s.display.map((_, id) => queues[id][0]?.seat ?? null);
    const display = s.display.map((board, id) => {
      const q = queues[id];
      // Long sowings catch up: a few stones per drop once the queue grows.
      if (q.length && !drop) return board;
      if (q.length)
        return q.splice(0, Math.ceil(q.length / 20)).at(-1)?.board ?? board;
      if (!isEmpty(s.tables[id])) return s.tables[id].board;
      // Nobody here: the computer plays itself, client-side.
      const d = demo[id];
      if (++d.wait < DEMO_PAUSE) return board;
      d.wait = 0;
      if (isOver(board)) {
        d.turn = 0;
        return newBoard();
      }
      const r = sow(board, d.turn, pickMove(board, d.turn));
      q.push(...r.steps.map((b) => ({ board: b, seat: d.turn })));
      d.turn = r.turn;
      return board;
    });
    if (display.some((b, i) => b !== s.display[i])) patch.display = display;
    if (sowing.some((x, i) => x !== s.sowing[i])) patch.sowing = sowing;
    if (patch.players || patch.display || patch.sowing || now !== s.now)
      set(patch);
  };

  return {
    status: 'idle',
    you: null,
    players: {},
    bubbles: {},
    tables: [],
    display: [],
    sowing: [],
    viewing: null,
    now: Date.now(),
    muted: false,
    nameTaken: false,
    toggleMute: () => set((s) => ({ muted: !s.muted })),

    connect: (name, color) => {
      clearTimeout(retry);
      ws?.close();
      set({ status: 'connecting', nameTaken: false });
      const proto = location.protocol === 'https:' ? 'wss' : 'ws';
      const q = new URLSearchParams({ id: playerId(), name, color });
      const socket = new WebSocket(`${proto}://${location.host}/api/room?${q}`);
      ws = socket;
      socket.onopen = () => set({ status: 'open' });
      socket.onmessage = (e) => onMessage(JSON.parse(e.data));
      socket.onclose = (e) => {
        if (ws !== socket) return; // replaced or closed on purpose
        if (e.code === NAME_TAKEN) {
          get().disconnect();
          return set({ nameTaken: true });
        }
        ws = null;
        set({ status: 'closed' });
        // Dropped: come back while the server still holds our seat.
        if (e.code !== 4000)
          retry = setTimeout(() => get().connect(name, color), 2000);
      };
      clearInterval(timer);
      timer = setInterval(tick, TICK_MS);
    },

    disconnect: () => {
      const socket = ws;
      ws = null;
      socket?.close();
      clearTimeout(retry);
      clearInterval(timer);
      route = [];
      pendingSit = null;
      set({
        status: 'idle',
        players: {},
        tables: [],
        display: [],
        you: null,
        viewing: null,
      });
    },

    send: (msg) => {
      if (ws?.readyState === WebSocket.OPEN) ws.send(JSON.stringify(msg));
    },

    walkTo: (to, sit) => {
      const { you, players } = get();
      const me = you && players[you];
      if (!me) return;
      // Route over tiles, then cut every corner the straight line can.
      const tile = (p: Tile) => ({ x: Math.round(p.x), y: Math.round(p.y) });
      const here = tile(me);
      const goal = tile(to);
      const path = findPath(here, goal);
      const same = here.x === goal.x && here.y === goal.y;
      route = [];
      pendingSit = null;
      if (!path.length && !same) return;
      const pts = [...path.slice(0, -1), to];
      for (let from: Tile = me, i = 0; i < pts.length; ) {
        let j = pts.length - 1;
        while (j > i && !lineClear(from, pts[j])) j--;
        route.push(pts[j]);
        from = pts[j];
        i = j + 1;
      }
      pendingSit = sit ?? null;
    },

    view: openBoard,
  };
});
