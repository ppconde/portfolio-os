// Blob Club layout and wire protocol, shared by the room server and the browser.
import type { Seat } from './mancala';

export const COLS = 22;
export const ROWS = 12;
export const TILE = 32;
export const SHELF_ROWS = 2; // bookshelves along the back wall
export const SPAWN = { x: 11, y: 11 }; // the door
export const COLORS = ['#3b82f6', '#ef4444', '#22c55e', '#eab308', '#a855f7', '#f97316']; // biome-ignore format: palette

export type Tile = { x: number; y: number };

// Three 5-tile tables mid-floor; seat 0 sits in front (south), seat 1 behind.
export const TABLES = [2, 9, 16].map((x, id) => ({
  id,
  x,
  y: 6,
  w: 5,
  seats: [
    { x: x + 2, y: 7 },
    { x: x + 2, y: 5 },
  ] as [Tile, Tile],
}));

// The Computer always sits at the back of the right-hand table, waiting for a game.
export const PC_TABLE = 2;
export const COMPUTER = { id: 'computer', name: 'Computer', ai: true };

export const isBlocked = ({ x, y }: Tile) =>
  x < 0 ||
  y < SHELF_ROWS ||
  x >= COLS ||
  y >= ROWS ||
  TABLES.some((t) => y === t.y && x >= t.x && x < t.x + t.w);

export const isNear = (a: Tile, b: Tile) =>
  Math.abs(a.x - b.x) <= 1 && Math.abs(a.y - b.y) <= 1;

// Shortest 4-way path from `from` to `to`, excluding `from`; [] if unreachable.
export function findPath(from: Tile, to: Tile): Tile[] {
  if (isBlocked(to)) return [];
  const key = (t: Tile) => t.y * COLS + t.x;
  const prev = new Map<number, Tile | null>([[key(from), null]]);
  const queue = [from];
  while (queue.length) {
    const cur = queue.shift() as Tile;
    if (cur.x === to.x && cur.y === to.y) {
      const path: Tile[] = [];
      for (let t = cur; key(t) !== key(from); t = prev.get(key(t)) as Tile)
        path.unshift(t);
      return path;
    }
    for (const [dx, dy] of [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ]) {
      const next = { x: cur.x + dx, y: cur.y + dy };
      if (isBlocked(next) || prev.has(key(next))) continue;
      prev.set(key(next), cur);
      queue.push(next);
    }
  }
  return [];
}

export type SeatInfo = {
  id: string;
  name: string;
  away?: number; // disconnected; seat held until this time
  ai?: boolean; // the server plays for this seat
} | null;

export type TableState = {
  id: number;
  seats: [SeatInfo, SeatInfo];
  board: number[];
  turn: Seat;
  version: number;
  result: string | null;
  resultUntil: number | null;
};

export type Player = { id: string; name: string; color: string } & Tile;

export type ClientMsg =
  | ({ t: 'pos' } & Tile)
  | { t: 'say'; text: string }
  | { t: 'sit'; tableId: number; seat: Seat }
  | { t: 'stand' }
  | { t: 'move'; tableId: number; pit: number; version: number };

export type ServerMsg =
  | { t: 'snapshot'; you: string; players: Player[]; tables: TableState[] }
  | { t: 'joined'; player: Player }
  | { t: 'left'; id: string }
  | ({ t: 'pos'; id: string } & Tile)
  | { t: 'say'; id: string; text: string }
  | { t: 'seated' | 'stood' | 'gameOver' | 'tableReset'; table: TableState }
  | { t: 'moveApplied'; table: TableState; seat: Seat; pit: number };
