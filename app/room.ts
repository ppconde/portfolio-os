// Mancala lounge layout and wire protocol, shared by the room server and the browser.
import type { Seat } from './mancala';

export const COLS = 32;
export const ROWS = 18;
export const TILE = 32; // 32x18 tiles = the 1024x576 lounge picture
export const NAME_MAX = 10;
export const NAME_TAKEN = 4001; // close code: someone here already has that name
export const SPAWN = { x: 16, y: 10 }; // middle of the room
export const COLORS = ['#3b82f6', '#ef4444', '#22c55e', '#eab308', '#a855f7', '#f97316']; // biome-ignore format: palette

export type Tile = { x: number; y: number };

// The five tables painted in the lounge picture, back to front. Each blocks the
// tiles under it; seat 0 is the cushion on its left, seat 1 the one on its right.
export const TABLES = (
  [
    [12, 8, 3, 1, { x: 11, y: 8 }, { x: 15, y: 8 }],
    [19, 8, 2, 2, { x: 18, y: 8 }, { x: 21, y: 9 }],
    [7, 10, 3, 3, { x: 6, y: 11 }, { x: 10, y: 12 }],
    [15, 12, 3, 3, { x: 14, y: 13 }, { x: 18, y: 14 }],
    [23, 12, 4, 2, { x: 22, y: 12 }, { x: 27, y: 13 }],
  ] as const
).map(([x, y, w, h, a, b], id) => ({
  id,
  x,
  y,
  w,
  h,
  seats: [a, b] as [Tile, Tile],
}));

// The Computer always sits at the front-right table, waiting for a game.
export const PC_TABLE = 4;
export const COMPUTER = { id: 'computer', name: 'Computer', ai: true };

// Walkable floor per row, [first, last] column; furniture and walls are off it.
const FLOOR: Record<number, [number, number]> = {
  8: [7, 23], 9: [7, 23], 10: [6, 25], 11: [5, 26], 12: [5, 27],
  13: [5, 28], 14: [4, 28], 15: [4, 28], 16: [2, 28],
}; // biome-ignore format: a map

// Positions are free (fractional tiles); a spot is blocked if its nearest tile is.
export const isBlocked = (p: Tile) => {
  const x = Math.round(p.x);
  const y = Math.round(p.y);
  return (
    !FLOOR[y] ||
    x < FLOOR[y][0] ||
    x > FLOOR[y][1] ||
    TABLES.some((t) => x >= t.x && x < t.x + t.w && y >= t.y && y < t.y + t.h)
  );
};

export const STEP = 0.8; // tiles walked per tick; the server allows up to 1

// Nothing blocked on the straight line from a to b. Exact: the line only enters
// a new tile where it crosses a tile edge (x or y = n + 0.5), so check a point
// between every pair of crossings.
export const lineClear = (a: Tile, b: Tile) => {
  const ts = [0, 1];
  for (const k of ['x', 'y'] as const) {
    const hi = Math.max(a[k], b[k]);
    for (let g = Math.floor(Math.min(a[k], b[k]) - 0.5) + 1.5; g < hi; g++)
      ts.push((g - a[k]) / (b[k] - a[k]));
  }
  ts.sort((p, q) => p - q);
  // Skip the first span: it's the tile we're standing on.
  for (let i = 2; i < ts.length; i++) {
    const t = (ts[i - 1] + ts[i]) / 2;
    if (isBlocked({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t }))
      return false;
  }
  return !isBlocked(b);
};

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
