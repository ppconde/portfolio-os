import { create } from 'zustand';
import { AppsNames } from '~/constants/apps-names.const';
import { isOver, newBoard, pickMove, type Seat, sow } from '~/mancala';
import {
  type ClientMsg,
  findPath,
  type Player,
  type SeatInfo,
  type ServerMsg,
  TABLES,
  type TableState,
  type Tile,
} from '~/room';
import { useWindowsStore } from './WindowsStore';

const TICK_MS = 150; // one walking step / one sown stone
export const BUBBLE_MS = 5_000;
const DEMO_PAUSE = 5; // ticks between demo moves

type RoomStore = {
  status: 'idle' | 'connecting' | 'open' | 'closed';
  you: string | null;
  players: Record<string, Player>;
  bubbles: Record<string, { text: string; at: number }>;
  tables: TableState[]; // the server's truth
  display: number[][]; // what boards show right now (mid-animation, or the demo)
  viewing: number | null; // the table in the Mancala window
  now: number;
  connect: (name: string, color: string) => void;
  disconnect: () => void;
  send: (msg: ClientMsg) => void;
  walkTo: (to: Tile, sit?: { tableId: number; seat: Seat }) => void;
  view: (tableId: number) => void;
};

export const seatName = (s: SeatInfo) =>
  s ? `${s.name}${s.away ? ' (away)' : ''}` : '';

export const tableLabel = (t: TableState) => {
  if (t.result) return t.result;
  const [a, b] = t.seats;
  if (a && b) return `${seatName(a)} vs ${seatName(b)}`;
  return a || b ? 'Waiting for opponent…' : 'Free – sit to play';
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
const queues: number[][][] = TABLES.map(() => []); // animation steps per table
const demo = TABLES.map(() => ({ turn: 0 as Seat, wait: 0 }));

export const useRoomStore = create<RoomStore>((set, get) => {
  const openBoard = (tableId: number) => {
    set({ viewing: tableId });
    useWindowsStore.getState().addWindow(AppsNames.MANCALA);
  };

  const onTable = (msg: Extract<ServerMsg, { table: TableState }>) => {
    const { tables, display, you, viewing } = get();
    const old = tables[msg.table.id];
    const t = msg.table;
    const id = t.id;
    if (msg.t === 'moveApplied' && t.version === old.version + 1)
      queues[id].push(...sow(old.board, msg.seat, msg.pit).steps);
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
    // Stood up (Escape, floor click): the board window goes too.
    if (wasMine && !isMine && viewing === id)
      useWindowsStore.getState().closeWindow(AppsNames.MANCALA);
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
                players: { ...s.players, [p.id]: { ...p, x: msg.x, y: msg.y } },
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
    const patch: Partial<RoomStore> = { now: Date.now() };
    const me = s.you && s.players[s.you];
    const next = route.shift();
    if (me && next) {
      patch.players = { ...s.players, [me.id]: { ...me, ...next } };
      s.send({ t: 'pos', ...next });
    }
    if (me && !next && pendingSit) {
      s.send({ t: 'sit', ...pendingSit });
      pendingSit = null;
    }

    const display = s.display.map((board, id) => {
      const q = queues[id];
      // Long sowings catch up: a few stones per tick once the queue grows.
      if (q.length)
        return q.splice(0, Math.ceil(q.length / 12)).at(-1) as number[];
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
      d.turn = r.turn;
      q.push(...r.steps);
      return board;
    });
    if (display.some((b, i) => b !== s.display[i])) patch.display = display;
    set(patch);
  };

  return {
    status: 'idle',
    you: null,
    players: {},
    bubbles: {},
    tables: [],
    display: [],
    viewing: null,
    now: Date.now(),

    connect: (name, color) => {
      clearTimeout(retry);
      ws?.close();
      set({ status: 'connecting' });
      const proto = location.protocol === 'https:' ? 'wss' : 'ws';
      const q = new URLSearchParams({ id: playerId(), name, color });
      const socket = new WebSocket(`${proto}://${location.host}/api/room?${q}`);
      ws = socket;
      socket.onopen = () => set({ status: 'open' });
      socket.onmessage = (e) => onMessage(JSON.parse(e.data));
      socket.onclose = (e) => {
        if (ws !== socket) return; // replaced or closed on purpose
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
      ws = null; // first, so closing the board window below doesn't send "stand"
      socket?.close();
      clearTimeout(retry);
      clearInterval(timer);
      route = [];
      pendingSit = null;
      set({ status: 'idle', players: {}, tables: [], display: [], you: null });
      useWindowsStore.getState().closeWindow(AppsNames.MANCALA);
    },

    send: (msg) => {
      if (ws?.readyState === WebSocket.OPEN) ws.send(JSON.stringify(msg));
    },

    walkTo: (to, sit) => {
      const { you, players } = get();
      const me = you && players[you];
      if (!me) return;
      route = findPath(me, to);
      pendingSit =
        sit && (route.length || (me.x === to.x && me.y === to.y)) ? sit : null;
    },

    view: openBoard,
  };
});

// Closing the board window stands you up (the server applies the forfeit rule mid-game).
useWindowsStore.subscribe((s, prev) => {
  const open = (w: typeof s.windows) =>
    w.some((x) => x.id === AppsNames.MANCALA);
  if (!open(prev.windows) || open(s.windows)) return;
  const { tables, you, viewing, send } = useRoomStore.getState();
  if (viewing !== null && mySeat(tables[viewing], you) >= 0)
    send({ t: 'stand' });
  useRoomStore.setState({ viewing: null });
});
