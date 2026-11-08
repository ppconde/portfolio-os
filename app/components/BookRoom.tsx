import { useEffect, useRef, useState } from 'react';
import type { Seat } from '~/mancala';
import {
  COLORS,
  COLS,
  COMPUTER,
  isBlocked,
  PC_TABLE,
  ROWS,
  SHELF_ROWS,
  SPAWN,
  TABLES,
  TILE,
  type Tile,
} from '~/room';
import {
  BUBBLE_MS,
  mySeat,
  seatName,
  tableLabel,
  useRoomStore,
} from '~/store/RoomStore';
import { Board } from './Mancala';

const W = COLS * TILE;
const H = ROWS * TILE;
const NAMES = ['Blu', 'Pip', 'Juno', 'Ziggy', 'Mo', 'Rex'];
const BOOKS = ['#7f1d1d', '#1e3a8a', '#14532d', '#78350f', '#4c1d95'];
const KEYS: Record<string, [number, number]> = {
  ArrowUp: [0, -1],
  ArrowDown: [0, 1],
  ArrowLeft: [-1, 0],
  ArrowRight: [1, 0],
  w: [0, -1],
  s: [0, 1],
  a: [-1, 0],
  d: [1, 0],
};

const store = (key: string, value?: string) => {
  try {
    if (value === undefined) return localStorage.getItem(key);
    localStorage.setItem(key, value);
  } catch {} // private mode: just don't remember
  return null;
};

// Greedy word wrap for speech bubbles.
const wrap = (text: string, width = 26) =>
  text.split(' ').reduce<string[]>((lines, word) => {
    const last = lines.at(-1);
    if (last !== undefined && (last + word).length < width)
      lines[lines.length - 1] = `${last} ${word}`.trim();
    else lines.push(word);
    return lines;
  }, []);

// A speech bubble above a blob standing on `p`.
function bubble(p: Tile & { id: string; name: string }, text: string) {
  const lines = wrap(text);
  const w = Math.max(...lines.map((l) => l.length)) * 5 + 10;
  const h = lines.length * 10 + 6;
  const x = Math.min(Math.max((p.x + 0.5) * TILE - w / 2, 2), W - w - 2);
  // Back seats float a tile higher so the table's label stays readable.
  const y = (p.y + (p.y === TABLES[0].y - 1 ? 0 : 1)) * TILE - 32 - h;
  return (
    <g data-testid={`bubble-${p.name}`} key={p.id}>
      <rect
        fill="#fdffff"
        height={h}
        rx="4"
        stroke="#111"
        width={w}
        x={x}
        y={y}
      />
      {lines.map((l, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: line order is fixed
        <text fontSize="9" key={i} x={x + 5} y={y + 12 + i * 10}>
          {l}
        </text>
      ))}
    </g>
  );
}

export default function BookRoom() {
  const status = useRoomStore((s) => s.status);
  // Closing the window leaves the room.
  useEffect(() => () => useRoomStore.getState().disconnect(), []);
  return status === 'idle' ? <Join /> : <Scene />;
}

function Join() {
  const [name, setName] = useState(
    () => store('room-name') ?? NAMES[Math.floor(Math.random() * NAMES.length)]
  );
  return (
    <form
      className="flex h-full flex-col items-center justify-center gap-3 font-mono"
      onSubmit={(e) => {
        e.preventDefault();
        store('room-name', name);
        const color = COLORS[Math.floor(Math.random() * COLORS.length)];
        useRoomStore.getState().connect(name, color);
      }}
    >
      <p>Walk around the Book Room and play Mancala with whoever's here.</p>
      <label className="flex items-center gap-2">
        Your name
        <input
          className="border-windows-sunken border-2 px-1"
          maxLength={16}
          onChange={(e) => setName(e.target.value)}
          required
          value={name}
        />
      </label>
      <button className="border-windows bg-secondary px-4 py-1" type="submit">
        Enter
      </button>
    </form>
  );
}

function Scene() {
  const {
    players,
    tables,
    display,
    you,
    bubbles,
    now,
    status,
    send,
    walkTo,
    view,
  } = useRoomStore(); // re-renders every tick anyway
  const svgRef = useRef<SVGSVGElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const [text, setText] = useState('');
  useEffect(() => rootRef.current?.focus(), []);

  const me = you ? players[you] : undefined;
  const seated = tables.some((t) => mySeat(t, you) >= 0);
  const full = (id: number) => !!(tables[id].seats[0] && tables[id].seats[1]);

  const clickTable = (id: number, seat?: Seat) => {
    const t = tables[id];
    if (!me || !t) return;
    // Your own game, someone else's, or you're busy at another table: watch.
    if (seated || full(id)) return full(id) && view(id);
    const free = ([0, 1] as const).filter((i) => !t.seats[i]);
    const pick =
      seat !== undefined && free.includes(seat)
        ? seat
        : free.sort(
            (a, b) =>
              Math.abs(TABLES[id].seats[a].y - me.y) -
              Math.abs(TABLES[id].seats[b].y - me.y)
          )[0];
    walkTo(TABLES[id].seats[pick], { tableId: id, seat: pick });
  };

  const onFloor = (e: React.MouseEvent) => {
    if (seated) return send({ t: 'stand' });
    const svg = svgRef.current;
    const ctm = svg?.getScreenCTM();
    if (!svg || !ctm) return;
    const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(ctm.inverse());
    walkTo({ x: Math.floor(p.x / TILE), y: Math.floor(p.y / TILE) });
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (!me || (e.target as Element).tagName === 'INPUT') return;
    const dir = KEYS[e.key];
    if (dir) {
      e.preventDefault();
      const next = { x: me.x + dir[0], y: me.y + dir[1] };
      if (!seated && !isBlocked(next)) walkTo(next);
    } else if (e.key === 'Escape' && seated) send({ t: 'stand' });
    else if (e.key === 'Enter' || e.key === ' ') {
      for (const t of TABLES)
        t.seats.forEach((spot, seat) => {
          if (spot.x === me.x && spot.y === me.y && !tables[t.id].seats[seat]) {
            e.preventDefault();
            send({ t: 'sit', tableId: t.id, seat: seat as Seat });
          }
        });
    }
  };

  // Tables and blobs drawn back to front by where they touch the floor.
  // AI seats (the resident Computer, or a stand-in) are drawn as blobs too.
  const computers = tables.flatMap((t) =>
    t.seats.flatMap((s, seat) =>
      s?.ai
        ? [
            {
              ...TABLES[t.id].seats[seat],
              id: s.id,
              name: seatName(s),
              color: '#9ca3af',
            },
          ]
        : []
    )
  );
  const pcSeat = tables[PC_TABLE]?.seats[0];
  const myTable = tables.find((t) => mySeat(t, you) >= 0);
  const sorted = [
    ...TABLES.map((t) => ({ y: (t.y + 1) * TILE, key: `t${t.id}`, table: t })),
    ...[...Object.values(players), ...computers].map((p) => ({
      y: (p.y + 1) * TILE + 1,
      key: p.id,
      player: p,
    })),
  ].sort((a, b) => a.y - b.y);

  return (
    <div
      aria-label="Book Room. Arrow keys walk, Enter sits on a cushion, Escape stands up."
      className="flex h-full flex-col gap-2 outline-none"
      onKeyDown={onKey}
      ref={rootRef}
      role="application"
      // biome-ignore lint/a11y/noNoninteractiveTabindex: the room takes arrow keys to walk
      tabIndex={0}
    >
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: arrow keys on the room walk */}
      <svg
        className="min-h-0 w-full grow"
        data-testid="book-room"
        onClick={onFloor}
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
      >
        <title>Book Room</title>
        <defs>
          <pattern
            height="16"
            id="planks"
            patternUnits="userSpaceOnUse"
            width={W}
          >
            <rect fill="#c9a26b" height="16" width={W} />
            <rect fill="#b48a55" height="1" width={W} y="15" />
          </pattern>
        </defs>
        <rect fill="url(#planks)" height={H} width={W} />
        {/* Bookshelves along the back wall */}
        <rect fill="#4a2c12" height={SHELF_ROWS * TILE} width={W} />
        {Array.from({ length: W / 8 }, (_, i) =>
          [0, 1].map((shelf) => {
            const h = 20 + ((i * 13 + shelf * 5) % 9);
            return (
              <rect
                fill={BOOKS[(i * 7 + shelf * 3) % BOOKS.length]}
                height={h}
                // biome-ignore lint/suspicious/noArrayIndexKey: fixed decoration
                key={`${i}-${shelf}`}
                width={7}
                x={i * 8}
                y={shelf * TILE + TILE - 3 - h}
              />
            );
          })
        )}
        {[TILE - 3, 2 * TILE - 3].map((y) => (
          <rect fill="#2e1a0a" height="3" key={y} width={W} y={y} />
        ))}
        <rect
          fill="#2e1a0a"
          height="4"
          width={TILE * 2}
          x={(SPAWN.x - 0.5) * TILE}
          y={H - 4}
        />

        {/* Seat cushions */}
        {tables.length > 0 &&
          TABLES.map((t) =>
            t.seats.map((spot, seat) => {
              const taken = tables[t.id].seats[seat];
              const waiting = !taken && tables[t.id].seats[1 - seat];
              return (
                // biome-ignore lint/a11y/useSemanticElements: an SVG shape
                <ellipse
                  aria-label={`Table ${t.id + 1}, ${seat ? 'back' : 'front'} seat${taken ? ' (taken)' : ''}`}
                  className={
                    waiting ? 'animate-pulse cursor-pointer' : 'cursor-pointer'
                  }
                  cx={(spot.x + 0.5) * TILE}
                  // The back cushion peeks out above the tabletop.
                  cy={(spot.y + (seat ? 0.35 : 0.75)) * TILE}
                  data-testid={`seat-${t.id}-${seat}`}
                  fill="#b91c1c"
                  // biome-ignore lint/suspicious/noArrayIndexKey: seat number is the identity
                  key={seat}
                  onClick={(e) => {
                    e.stopPropagation();
                    clickTable(t.id, seat as Seat);
                  }}
                  onKeyDown={(e) =>
                    e.key === 'Enter' && clickTable(t.id, seat as Seat)
                  }
                  role="button"
                  rx={TILE * 0.45}
                  ry={TILE * 0.2}
                  stroke="#7f1d1d"
                  tabIndex={-1}
                />
              );
            })
          )}

        {sorted.map((d) => {
          if ('table' in d) {
            const t = d.table;
            const x = t.x * TILE;
            const y = t.y * TILE;
            return (
              // biome-ignore lint/a11y/useSemanticElements: an SVG group
              <g
                aria-label={`Table ${t.id + 1}`}
                className="cursor-pointer"
                key={d.key}
                onClick={(e) => {
                  e.stopPropagation();
                  clickTable(t.id);
                }}
                onKeyDown={(e) => e.key === 'Enter' && clickTable(t.id)}
                role="button"
                tabIndex={-1}
              >
                {[x + 6, x + t.w * TILE - 10].map((lx) => (
                  <rect
                    fill="#3f2108"
                    height="10"
                    key={lx}
                    width="4"
                    x={lx}
                    y={y + TILE - 2}
                  />
                ))}
                <rect
                  fill="#6b3410"
                  height="10"
                  rx="2"
                  width={t.w * TILE - 4}
                  x={x + 2}
                  y={y + TILE - 6}
                />
                <rect
                  fill="#a0522d"
                  height={TILE + 4}
                  rx="4"
                  width={t.w * TILE - 4}
                  x={x + 2}
                  y={y - 10}
                />
                {display[t.id] && (
                  <Board
                    board={display[t.id]}
                    h={TILE - 6}
                    w={t.w * TILE - 24}
                    x={x + 12}
                    y={y - 7}
                  />
                )}
              </g>
            );
          }
          const p = d.player;
          const seat = tables
            .flatMap((t) => t.seats)
            .find((s) => s?.id === p.id);
          // Front seat (seat 0) faces away from us: no face.
          const facing = seat ? (p.y > TABLES[0].y ? 'away' : 'down') : 'front';
          return (
            <g
              data-testid={`blob-${p.name}`}
              key={d.key}
              style={{
                transform: `translate(${(p.x + 0.5) * TILE}px, ${(p.y + 1) * TILE - (facing === 'down' ? 16 : 6)}px)`,
                transition: 'transform 150ms linear',
              }}
            >
              <g
                className={seat ? 'blob-sit' : 'blob-hop'}
                key={seat ? 'sit' : `${p.x},${p.y}`}
              >
                {seat?.ai ? (
                  <>
                    <rect
                      fill="#9ca3af"
                      height="18"
                      rx="3"
                      stroke="#4b5563"
                      width="24"
                      x="-12"
                      y="-20"
                    />
                    <rect
                      fill="#0f172a"
                      height="11"
                      width="18"
                      x="-9"
                      y="-17"
                    />
                    {[-5, 3].map((ex) => (
                      <rect
                        fill="#4ade80"
                        height="3"
                        key={ex}
                        width="2"
                        x={ex}
                        y="-13"
                      />
                    ))}
                  </>
                ) : (
                  <ellipse
                    cx="0"
                    cy="-10"
                    fill={p.color}
                    rx="11"
                    ry="10"
                    stroke="#00000066"
                  />
                )}
                {!seat?.ai &&
                  facing !== 'away' &&
                  [-4, 4].map((ex) => (
                    <circle
                      cx={ex}
                      cy={facing === 'down' ? -8 : -12}
                      fill="#111"
                      key={ex}
                      r="1.6"
                    />
                  ))}
              </g>
              <text fill="#111" fontSize="8" textAnchor="middle" y="8">
                {p.name}
                {p.id === you && ' (you)'}
              </text>
            </g>
          );
        })}

        {/* Labels and speech bubbles stay on top */}
        {tables.map((t) => (
          <text
            data-testid={`table-label-${t.id}`}
            fill="#111"
            fontSize="10"
            key={t.id}
            paintOrder="stroke"
            stroke="#fdffff"
            strokeWidth="3"
            textAnchor="middle"
            x={(TABLES[t.id].x + TABLES[t.id].w / 2) * TILE}
            y={(TABLES[t.id].y - 1) * TILE - 10}
          >
            {tableLabel(t)}
          </text>
        ))}
        {Object.values(players).map((p) => {
          const b = bubbles[p.id];
          return b && now - b.at < BUBBLE_MS && bubble(p, b.text);
        })}
        {/* The Computer calls out every few seconds while its seat is free. */}
        {tables[PC_TABLE] &&
          !pcSeat &&
          now % 12_000 < 5_000 &&
          bubble(
            { ...COMPUTER, ...TABLES[PC_TABLE].seats[1] },
            "Anyone for Mancala? I'm the computer!"
          )}
        {status !== 'open' && (
          <text
            fill="#111"
            fontSize="16"
            textAnchor="middle"
            x={W / 2}
            y={H / 2}
          >
            Connecting…
          </text>
        )}
      </svg>
      <form
        className="flex gap-2 font-mono text-sm"
        onSubmit={(e) => {
          e.preventDefault();
          if (text.trim()) send({ t: 'say', text });
          setText('');
        }}
      >
        <input
          aria-label="Say something"
          className="border-windows-sunken min-w-0 grow border-2 px-1"
          maxLength={80}
          onChange={(e) => setText(e.target.value)}
          placeholder="Say something…"
          value={text}
        />
        <button className="border-windows bg-secondary px-3" type="submit">
          Say
        </button>
        {myTable && (
          <button
            className="border-windows bg-secondary px-3"
            onClick={() => send({ t: 'stand' })}
            type="button"
          >
            Stand up
          </button>
        )}
        {/* Nobody came: swap to the Computer's table. */}
        {myTable && myTable.id !== PC_TABLE && !full(myTable.id) && !pcSeat && (
          <button
            className="border-windows bg-secondary px-3"
            onClick={() => {
              send({ t: 'stand' });
              walkTo(TABLES[PC_TABLE].seats[0], { tableId: PC_TABLE, seat: 0 });
            }}
            type="button"
          >
            Play the computer
          </button>
        )}
      </form>
      <p className="font-mono text-xs">
        Click the floor to walk, a cushion to sit. Esc or a floor click stands
        you up.
      </p>
    </div>
  );
}
