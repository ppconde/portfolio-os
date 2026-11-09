import { mySeat, seatName, useRoomStore } from '~/store/RoomStore';
import RoomDialog from './RoomDialog';

const BEANS = [
  'red',
  'teal',
  'yellow',
  'pink',
  'blue',
  'black',
  'orange',
  'copper',
  'green',
  'silver',
  'pearl',
  'purple',
].map((c) => `/assets/mancala/bean_${c}.png`);

// Up to 8 beans in a spiral, more as a number.
function Stones({
  n,
  cx,
  cy,
  r,
  salt,
}: {
  n: number;
  cx: number;
  cy: number;
  r: number;
  salt: number;
}) {
  if (n > 8)
    return (
      <text
        dominantBaseline="central"
        fill="#fdffff"
        fontSize={r * 0.9}
        fontWeight="bold"
        paintOrder="stroke"
        stroke="#3b1f0a"
        strokeWidth={r * 0.12}
        textAnchor="middle"
        x={cx}
        y={cy}
      >
        {n}
      </text>
    );
  const b = r * 0.5; // bean size
  return Array.from({ length: n }, (_, k) => {
    const a = k * 2.4 + salt;
    const d = n === 1 ? 0 : r * 0.22 + k * r * 0.055;
    return (
      <image
        height={b}
        href={BEANS[(k * 5 + salt) % BEANS.length]}
        // biome-ignore lint/suspicious/noArrayIndexKey: stones are interchangeable
        key={k}
        width={b}
        x={cx + Math.cos(a) * d - b / 2}
        y={cy + Math.sin(a) * d - b / 2}
      />
    );
  });
}

// Measured off board.png (905×316): pit columns, row centres, pit radius,
// store centres.
const COLS = [200, 310, 421, 530, 640, 748];
const [TOP, BOTTOM, R] = [92, 219, 46];
const STORES = [87, 846];

type BoardProps = {
  board: number[];
  flip?: boolean; // seat 1's view: their pits along the bottom
  onPit?: (pit: number) => void; // pits the viewer may play
};

// A wooden tray: 6 pits per side, a store at each end. Seat 0's pits run along
// the bottom left to right into the right store (unless flipped).
function Board({ board, flip, onPit }: BoardProps) {
  const [low, high] = flip ? [7, 0] : [0, 7];
  const [right, left] = flip ? [13, 6] : [6, 13];
  const pits = COLS.flatMap((cx, c) => [
    { i: low + c, cx, cy: BOTTOM },
    { i: high + 5 - c, cx, cy: TOP },
  ]);

  return (
    <g>
      <image height={316} href="/assets/mancala/board.png" width={905} />
      {[
        { i: left, cx: STORES[0] },
        { i: right, cx: STORES[1] },
      ].map(({ i, cx }) => (
        // Stores show their total: it's the score.
        <text
          data-testid={onPit && `store-${i}`}
          dominantBaseline="central"
          fill="#fdffff"
          fontSize={R * 1.1}
          fontWeight="bold"
          key={i}
          paintOrder="stroke"
          stroke="#3b1f0a"
          strokeWidth={R * 0.15}
          textAnchor="middle"
          x={cx}
          y={156}
        >
          {board[i]}
        </text>
      ))}
      {pits.map(({ i, cx, cy }) => {
        const playable = onPit && board[i] > 0 && i >= low && i < low + 6;
        return (
          // biome-ignore lint/a11y/noStaticElementInteractions: role is set when playable
          <g
            aria-label={
              playable ? `Play pit with ${board[i]} stones` : undefined
            }
            className={playable ? 'cursor-pointer' : undefined}
            data-count={board[i]}
            data-testid={onPit && `pit-${i}`}
            key={i}
            onClick={playable ? () => onPit(i) : undefined}
            onKeyDown={
              playable ? (e) => e.key === 'Enter' && onPit(i) : undefined
            }
            role={playable ? 'button' : undefined}
            tabIndex={playable ? 0 : undefined}
          >
            {/* Transparent fill keeps the whole pit clickable. */}
            <circle
              cx={cx}
              cy={cy}
              fill="transparent"
              r={R}
              stroke={playable ? '#facc15' : 'none'}
              strokeWidth={6}
            />
            <Stones cx={cx} cy={cy} n={board[i]} r={R} salt={i} />
          </g>
        );
      })}
    </g>
  );
}

// The board for the table you're at (or watching), over the room.
export default function Mancala() {
  const t = useRoomStore((s) =>
    s.viewing === null ? undefined : s.tables[s.viewing]
  );
  const board = useRoomStore((s) => (t ? s.display[t.id] : undefined));
  const you = useRoomStore((s) => s.you);
  const send = useRoomStore((s) => s.send);
  const view = useRoomStore((s) => s.view);
  const sowing = useRoomStore((s) => (t ? s.sowing[t.id] : null));
  if (!t || !board) return null;

  const seat = mySeat(t, you);
  const playing = !!(t.seats[0] && t.seats[1] && !t.result);
  const animating = board !== t.board;
  // The server is ahead of the animation (the AI answers instantly), so show
  // whoever's stones are being sown, not whose turn it is now.
  const turn = sowing ?? t.turn;
  const myTurn = playing && seat === t.turn && !animating;
  const [top, bottom] =
    seat === 1 ? [t.seats[0], t.seats[1]] : [t.seats[1], t.seats[0]];
  const status =
    t.result ??
    (!playing
      ? 'Waiting for opponent…'
      : turn === seat
        ? 'Your turn'
        : `${seatName(t.seats[turn])}'s turn`);

  const topSeat = seat === 1 ? 0 : 1;
  // The player to move is highlighted like a Win98 selection.
  const name = (who: (typeof t.seats)[number], s: number) => (
    <p
      className={`self-center px-1 ${playing && turn === s ? 'bg-accent text-tertiary' : ''}`}
    >
      {seatName(who) || '—'}
    </p>
  );

  return (
    <RoomDialog
      data-testid="mancala-board"
      onClose={seat < 0 ? () => view(null) : undefined}
      title={`Table ${t.id + 1}${seat < 0 ? ' – watching' : ''}`}
    >
      {name(top, topSeat)}
      {/* The art's top few rows are stray pixels: crop them. */}
      <svg className="w-full" viewBox="0 8 905 308">
        <title>Mancala board, table {t.id + 1}</title>
        <Board
          board={board}
          flip={seat === 1}
          onPit={
            myTurn
              ? (pit) =>
                  send({ t: 'move', tableId: t.id, pit, version: t.version })
              : undefined
          }
        />
      </svg>
      {name(bottom, 1 - topSeat)}
      <div className="flex flex-wrap items-center gap-2">
        <p
          aria-live="polite"
          className="border-windows-sunken bg-tertiary min-w-0 grow basis-40 border-2 px-2 py-1 font-bold"
          data-testid="mancala-status"
        >
          {status}
        </p>
        <button
          className="border-windows bg-secondary active:border-windows-inverted shrink-0 grow px-4 py-1 whitespace-nowrap sm:grow-0"
          onClick={() => (seat >= 0 ? send({ t: 'stand' }) : view(null))}
          type="button"
        >
          {/* Walking out on a person mid-game hands them the win. */}
          {seat < 0
            ? 'Stop watching'
            : playing && !t.seats[1 - seat]?.ai
              ? 'Forfeit and leave'
              : 'Leave game'}
        </button>
      </div>
    </RoomDialog>
  );
}
