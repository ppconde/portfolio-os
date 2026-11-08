// Kalah rules, shared by the room server and the browser.
// Board: pits 0-5 + store 6 belong to seat 0; pits 7-12 + store 13 to seat 1.
export type Seat = 0 | 1;
export const STORE = [6, 13] as const;

export const newBoard = () => [4, 4, 4, 4, 4, 4, 0, 4, 4, 4, 4, 4, 4, 0];

const owns = (seat: Seat, i: number) =>
  seat === 0 ? i >= 0 && i < 6 : i >= 7 && i < 13;

export const isLegal = (board: number[], seat: Seat, pit: number) =>
  owns(seat, pit) && board[pit] > 0;

export const isOver = (board: number[]) =>
  board.slice(0, 6).every((n) => !n) || board.slice(7, 13).every((n) => !n);

// Sow `pit` for `seat`. `steps` holds the board after every stone dropped, then
// after a capture and the end-of-game sweep, so callers can animate it.
export function sow(board: number[], seat: Seat, pit: number) {
  const b = [...board];
  const steps = [];
  let n = b[pit];
  let i = pit;
  b[pit] = 0;
  steps.push([...b]);
  while (n) {
    i = (i + 1) % 14;
    if (i === STORE[1 - seat]) continue;
    b[i]++;
    n--;
    steps.push([...b]);
  }
  // Last stone in an own empty pit captures it and the opposite pit.
  if (owns(seat, i) && b[i] === 1 && b[12 - i]) {
    b[STORE[seat]] += b[12 - i] + 1;
    b[i] = b[12 - i] = 0;
    steps.push([...b]);
  }
  const turn: Seat = i === STORE[seat] ? seat : ((1 - seat) as Seat);
  const over = isOver(b);
  if (over) {
    for (const s of [0, 1] as const)
      for (let k = s * 7; k < s * 7 + 6; k++) {
        b[STORE[s]] += b[k];
        b[k] = 0;
      }
    steps.push([...b]);
  }
  return { board: b, turn, over, steps };
}

// ponytail: greedy one-ply AI (extra turn > biggest store gain), minimax if anyone wants a challenge.
export function pickMove(board: number[], seat: Seat) {
  let best = -1;
  let bestScore = -1;
  for (let k = 0; k < 6; k++) {
    const pit = seat * 7 + k;
    if (!isLegal(board, seat, pit)) continue;
    const r = sow(board, seat, pit);
    const score =
      (r.turn === seat && !r.over ? 100 : 0) +
      r.board[STORE[seat]] -
      board[STORE[seat]] +
      Math.random() * 0.5;
    if (score > bestScore) [best, bestScore] = [pit, score];
  }
  return best;
}

export function resultText(board: number[], names: [string, string]) {
  const [a, b] = [board[STORE[0]], board[STORE[1]]];
  if (a === b) return `Draw ${a}–${b}`;
  return a > b ? `${names[0]} wins ${a}–${b}` : `${names[1]} wins ${b}–${a}`;
}
