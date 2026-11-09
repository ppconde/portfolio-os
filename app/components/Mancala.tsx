import { mySeat, seatName, useRoomStore } from '~/store/RoomStore';
import RoomDialog from './RoomDialog';

const STONE = ['#e11d48', '#2563eb', '#16a34a', '#f59e0b', '#9333ea'];

// Up to 6 stones as dots, more as a number.
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
  if (n > 6)
    return (
      <text
        dominantBaseline="central"
        fill="#fff"
        fontSize={r * 1.1}
        textAnchor="middle"
        x={cx}
        y={cy}
      >
        {n}
      </text>
    );
  return Array.from({ length: n }, (_, k) => {
    const a = k * 2.4 + salt;
    const d = n === 1 ? 0 : r * 0.5;
    return (
      <circle
        cx={cx + Math.cos(a) * d}
        cy={cy + Math.sin(a) * d}
        fill={STONE[(k + salt) % STONE.length]}
        // biome-ignore lint/suspicious/noArrayIndexKey: stones are interchangeable
        key={k}
        r={r * 0.3}
      />
    );
  });
}

type BoardProps = {
  board: number[];
  w: number;
  h: number;
  flip?: boolean; // seat 1's view: their pits along the bottom
  onPit?: (pit: number) => void; // pits the viewer may play
};

// A wooden tray: 6 pits per side, a store at each end. Seat 0's pits run along
// the bottom left to right into the right store (unless flipped).
function Board({ board, w, h, flip, onPit }: BoardProps) {
  const sw = w / 8;
  const cw = (w - 2 * sw) / 6;
  const r = Math.min(cw, h / 2) * 0.4;
  const [low, high] = flip ? [7, 0] : [0, 7];
  const [right, left] = flip ? [13, 6] : [6, 13];
  const pits = Array.from({ length: 6 }, (_, c) => [
    { i: low + c, cx: sw + cw * (c + 0.5), cy: h * 0.75 },
    { i: high + 5 - c, cx: sw + cw * (c + 0.5), cy: h * 0.25 },
  ]).flat();

  return (
    <g>
      <rect fill="#8b5a2b" height={h} rx={h / 5} stroke="#4a2c12" width={w} />
      {[
        { i: left, cx: sw / 2 },
        { i: right, cx: w - sw / 2 },
      ].map(({ i, cx }) => (
        <g data-testid={onPit && `store-${i}`} key={i}>
          <rect
            fill="#5b3a1a"
            height={h * 0.8}
            rx={sw * 0.35}
            width={sw * 0.7}
            x={cx - sw * 0.35}
            y={h * 0.1}
          />
          {/* Stores show their total: it's the score. */}
          <text
            dominantBaseline="central"
            fill="#fdffff"
            fontSize={r * 1.1}
            fontWeight="bold"
            textAnchor="middle"
            x={cx}
            y={h / 2}
          >
            {board[i]}
          </text>
        </g>
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
            <circle
              cx={cx}
              cy={cy}
              fill="#5b3a1a"
              r={r}
              stroke={playable ? '#facc15' : 'none'}
              strokeWidth={r * 0.12}
            />
            <Stones cx={cx} cy={cy} n={board[i]} r={r} salt={i} />
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
  const turn = animating ? (sowing ?? t.turn) : t.turn;
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
      <svg className="w-full" viewBox="0 0 400 110">
        <title>Mancala board, table {t.id + 1}</title>
        <Board
          board={board}
          flip={seat === 1}
          h={110}
          onPit={
            myTurn
              ? (pit) =>
                  send({ t: 'move', tableId: t.id, pit, version: t.version })
              : undefined
          }
          w={400}
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
