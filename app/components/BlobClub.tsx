import { useEffect, useRef, useState } from 'react';
import type { Seat } from '~/mancala';
import {
  COLORS,
  COLS,
  COMPUTER,
  isBlocked,
  isNear,
  PC_TABLE,
  ROWS,
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
import Mancala from './Mancala';

const W = COLS * TILE;
const H = ROWS * TILE;
const NAMES = ['Blu', 'Pip', 'Juno', 'Ziggy', 'Mo', 'Rex'];
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
  // Monospace, so the width is exact: 0.6em per character at 12px.
  const w = Math.max(...lines.map((l) => l.length)) * 7.2 + 14;
  const h = lines.length * 14 + 8;
  const x = Math.min(Math.max((p.x + 0.5) * TILE - w / 2, 2), W - w - 2);
  const y = (p.y + 1) * TILE - 46 - h;
  return (
    <g className="font-mono" data-testid={`bubble-${p.name}`} key={p.id}>
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
        <text
          fontSize="12"
          // biome-ignore lint/suspicious/noArrayIndexKey: line order is fixed
          key={i}
          textAnchor="middle"
          x={x + w / 2}
          y={y + 16 + i * 14}
        >
          {l}
        </text>
      ))}
    </g>
  );
}

// Stable (module-level) so the room's per-tick re-renders don't re-run it.
// Unmounting stops the jazz and frees its buffered audio.
const jazzRef = (a: HTMLAudioElement | null) => {
  if (!a) return;
  a.src = '/audio/jazz.m4a';
  a.volume = 0.3;
  a.play().catch(() => {}); // blocked or unsupported: the room stays quiet
  return () => {
    a.pause();
    a.removeAttribute('src');
    a.load();
  };
};

export default function BlobClub() {
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
      <p>Walk around the lounge and play Mancala with whoever's here.</p>
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
    you,
    bubbles,
    now,
    status,
    send,
    walkTo,
    view,
    viewing,
    muted,
  } = useRoomStore(); // re-renders every tick anyway
  const svgRef = useRef<SVGSVGElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const [text, setText] = useState('');
  const [help, setHelp] = useState(false);
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
              Math.abs(TABLES[id].seats[a].x - me.x) -
              Math.abs(TABLES[id].seats[b].x - me.x)
          )[0];
    walkTo(TABLES[id].seats[pick], { tableId: id, seat: pick });
  };

  const onFloor = (e: React.MouseEvent) => {
    if (seated) return send({ t: 'stand' });
    const svg = svgRef.current;
    const ctm = svg?.getScreenCTM();
    if (!svg || !ctm) return;
    const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(ctm.inverse());
    // Feet land where you clicked.
    walkTo({ x: p.x / TILE - 0.5, y: p.y / TILE - 0.8 });
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (!me || (e.target as Element).tagName === 'INPUT') return;
    const dir = KEYS[e.key];
    if (dir) {
      e.preventDefault();
      const next = { x: me.x + dir[0] / 2, y: me.y + dir[1] / 2 };
      if (!seated && !isBlocked(next)) walkTo(next);
    } else if (e.key === 'Escape' && help) setHelp(false);
    else if (e.key === 'Escape' && seated) send({ t: 'stand' });
    else if (e.key === 'Escape') view(null);
    else if (e.key === 'Enter' || e.key === ' ') {
      for (const t of TABLES)
        t.seats.forEach((spot, seat) => {
          if (isNear(me, spot) && !tables[t.id].seats[seat]) {
            e.preventDefault();
            send({ t: 'sit', tableId: t.id, seat: seat as Seat });
          }
        });
    }
  };

  // Blobs drawn back to front by where they touch the floor.
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
  const sorted = [...Object.values(players), ...computers].sort(
    (a, b) => a.y - b.y
  );

  return (
    <div
      aria-label="Mancala lounge. Arrow keys walk, Enter sits on a cushion, Escape stands up."
      className="flex h-full flex-col gap-2 outline-none"
      onKeyDown={onKey}
      ref={rootRef}
      role="application"
      // biome-ignore lint/a11y/noNoninteractiveTabindex: the room takes arrow keys to walk
      tabIndex={0}
    >
      {/* Jazz while you're in the room; entering was a click, so it may autoplay. */}
      <audio data-testid="jazz" loop muted={muted} ref={jazzRef} />
      <div className="relative min-h-0 grow">
        {/* biome-ignore lint/a11y/useKeyWithClickEvents: arrow keys on the room walk */}
        <svg
          className="h-full w-full"
          data-testid="blob-club"
          onClick={onFloor}
          ref={svgRef}
          viewBox={`0 0 ${W} ${H}`}
        >
          <title>Mancala lounge</title>
          <image height={H} href="/assets/blob-club/lounge.png" width={W} />
          {/* The poster on the back wall */}
          {/* biome-ignore lint/a11y/useSemanticElements: an SVG shape */}
          <rect
            aria-label="How to play Mancala"
            className="cursor-pointer"
            data-testid="how-to-play"
            fill="transparent"
            height={TILE * 3.2}
            onClick={(e) => {
              e.stopPropagation();
              setHelp(true);
            }}
            onKeyDown={(e) => e.key === 'Enter' && setHelp(true)}
            role="button"
            tabIndex={0}
            width={TILE * 2.7}
            x={TILE * 15.4}
            y={TILE * 1.4}
          />
          {TABLES.map((t) => (
            // biome-ignore lint/a11y/useSemanticElements: an SVG shape
            <rect
              aria-label={`Table ${t.id + 1}`}
              className="cursor-pointer outline-none"
              fill="transparent"
              height={t.h * TILE}
              key={t.id}
              onClick={(e) => {
                e.stopPropagation();
                clickTable(t.id);
              }}
              onKeyDown={(e) => e.key === 'Enter' && clickTable(t.id)}
              role="button"
              tabIndex={-1}
              width={t.w * TILE}
              x={t.x * TILE}
              y={t.y * TILE}
            />
          ))}

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
                      waiting
                        ? 'animate-pulse cursor-pointer outline-none'
                        : 'cursor-pointer outline-none'
                    }
                    cx={(spot.x + 0.5) * TILE}
                    cy={(spot.y + 0.6) * TILE}
                    data-testid={`seat-${t.id}-${seat}`}
                    fill={waiting ? '#facc1566' : 'transparent'}
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
                    rx={TILE * 0.8}
                    ry={TILE * 0.45}
                    tabIndex={-1}
                  />
                );
              })
            )}

          {sorted.map((p) => {
            const seat = tables
              .flatMap((t) => t.seats)
              .find((s) => s?.id === p.id);
            return (
              <g
                className="pointer-events-none"
                data-testid={`blob-${p.name}`}
                key={p.id}
                style={{
                  transform: `translate(${(p.x + 0.5) * TILE}px, ${(p.y + 1) * TILE - 6}px) scale(1.5)`,
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
                    [-4, 4].map((ex) => (
                      <circle cx={ex} cy={-12} fill="#111" key={ex} r="1.6" />
                    ))}
                </g>
                <text
                  fill="#111"
                  fontSize="8"
                  paintOrder="stroke"
                  stroke="#fdffff"
                  strokeWidth="2"
                  textAnchor="middle"
                  y="8"
                >
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
              fontSize="14"
              key={t.id}
              paintOrder="stroke"
              stroke="#fdffff"
              strokeWidth="3"
              textAnchor="middle"
              x={(TABLES[t.id].x + TABLES[t.id].w / 2) * TILE}
              y={TABLES[t.id].y * TILE - 8}
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
        {viewing !== null && <Mancala />}
        {help && <HowToPlay close={() => setHelp(false)} />}
      </div>
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

function HowToPlay({ close }: { close: () => void }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/40 p-2">
      <div
        aria-labelledby="how-to-play-title"
        aria-modal="true"
        className="border-windows flex max-h-full w-full max-w-lg flex-col gap-2 overflow-auto bg-white p-3 font-mono text-sm"
        data-testid="how-to-play-panel"
        role="dialog"
      >
        <h2 className="text-base font-bold" id="how-to-play-title">
          How to play Mancala
        </h2>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            Each player has 6 pits with 4 stones, and a store at their right
            end.
          </li>
          <li>
            On your turn, pick one of your pits. Its stones are dropped one by
            one into the next pits, counter-clockwise, into your store but never
            your opponent's.
          </li>
          <li>Last stone lands in your store? Go again.</li>
          <li>
            Last stone lands in an empty pit on your side? Capture it plus every
            stone in the pit facing it.
          </li>
          <li>
            When one side runs out of stones, the other player banks what's left
            on theirs. Most stones in the store wins.
          </li>
        </ul>
        <p>
          Click a cushion to sit. When someone sits opposite you, the game
          starts. No one around? The Computer is always up for a game.
        </p>
        <button
          className="border-windows bg-secondary self-center px-4 py-1"
          onClick={close}
          type="button"
        >
          Got it
        </button>
      </div>
    </div>
  );
}
