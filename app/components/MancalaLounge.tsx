import { useEffect, useRef, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import type { Seat } from '~/mancala';
import { H, isBlocked, isNear, PC_TABLE, TABLES, TILE, W } from '~/room';
import { mySeat, tableLabel, useRoomStore } from '~/store/RoomStore';
import Blobs from './lounge/Blobs';
import Bubbles from './lounge/Bubbles';
import Chat from './lounge/Chat';
import HowToPlay from './lounge/HowToPlay';
import Join from './lounge/Join';
import Mancala from './Mancala';
import RoomDialog from './RoomDialog';

// Module-level element: Scene's tick re-renders skip the board.
const BOARD = <Mancala />;
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

export default function MancalaLounge() {
  const status = useRoomStore((s) => s.status);
  // Closing the window leaves the room.
  useEffect(() => () => useRoomStore.getState().disconnect(), []);
  if (status === 'idle') return <Join />;
  if (status === 'open') return <Scene />;
  return <Connecting again={status === 'closed'} />;
}

function Connecting({ again }: { again: boolean }) {
  return (
    <div className="relative h-full bg-[#2b1612]">
      <RoomDialog title="Mancala lounge">
        <p aria-live="polite">
          {again ? 'Reconnecting…' : 'Connecting to the lounge…'}
        </p>
        {/* A Win98 marquee bar: blue blocks sliding through a sunken well. */}
        <div className="border-windows-sunken bg-tertiary h-6 overflow-hidden border-2 p-0.5">
          <div className="lounge-marquee h-full w-1/3 bg-[repeating-linear-gradient(90deg,var(--color-accent)_0_10px,transparent_10px_12px)]" />
        </div>
      </RoomDialog>
    </div>
  );
}

function Scene() {
  const { tables, you, send, walkTo, view, viewing, muted } = useRoomStore(
    // Only what the room draws. Players (moving every tick) are drawn by <Blobs>,
    // and boards animating at empty tables (display) by the board overlay.
    useShallow((s) => ({
      tables: s.tables,
      you: s.you,
      send: s.send,
      walkTo: s.walkTo,
      view: s.view,
      viewing: s.viewing,
      muted: s.muted,
    }))
  );
  const svgRef = useRef<SVGSVGElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const [help, setHelp] = useState(false);
  useEffect(() => rootRef.current?.focus(), []);

  // Read on demand, not subscribed: only handlers need where you stand.
  const getMe = () => {
    const s = useRoomStore.getState();
    return s.you ? s.players[s.you] : undefined;
  };
  const seated = tables.some((t) => mySeat(t, you) >= 0);
  const full = (id: number) => !!(tables[id].seats[0] && tables[id].seats[1]);

  const clickTable = (id: number, seat?: Seat) => {
    const t = tables[id];
    const me = getMe();
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
    const me = getMe();
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

  const pcSeat = tables[PC_TABLE]?.seats[0];
  const myTable = tables.find((t) => mySeat(t, you) >= 0);

  return (
    <div
      aria-label="Mancala lounge. Arrow keys walk, Enter sits on a cushion, Escape stands up."
      className="h-full outline-none"
      onKeyDown={onKey}
      ref={rootRef}
      role="application"
      // biome-ignore lint/a11y/noNoninteractiveTabindex: the room takes arrow keys to walk
      tabIndex={0}
    >
      {/* Jazz while you're in the room; entering was a click, so it may autoplay. */}
      <audio data-testid="jazz" loop muted={muted} ref={jazzRef} />
      {/* The stage keeps the picture's 16:9; the bands match its walls. */}
      <div className="[container-type:size] relative flex h-full items-center justify-center bg-[#2b1612]">
        <div className="aspect-video w-[min(100cqw,calc(100cqh*16/9))]">
          {/* biome-ignore lint/a11y/useKeyWithClickEvents: arrow keys on the room walk */}
          <svg
            className="h-full w-full"
            onClick={onFloor}
            ref={svgRef}
            viewBox={`0 0 ${W} ${H}`}
          >
            <title>Mancala lounge</title>
            <image height={H} href="/img/mancala/lounge.webp" width={W} />
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

            <Blobs />

            {/* Labels and speech bubbles stay on top */}
            {tables.map((t) => (
              <text
                data-testid={`table-label-${t.id}`}
                fill="#111"
                fontSize="17"
                fontWeight="600"
                key={t.id}
                paintOrder="stroke"
                stroke="#fdffff"
                strokeWidth="4"
                textAnchor="middle"
                x={(TABLES[t.id].x + TABLES[t.id].w / 2) * TILE}
                y={TABLES[t.id].y * TILE - 8}
              >
                {tableLabel(t)}
              </text>
            ))}
            <Bubbles computerFree={!!tables[PC_TABLE] && !pcSeat} />
          </svg>
        </div>
        {/* Floats on the picture, so it sits exactly where the join screen showed it. */}
        <Chat>
          {myTable && (
            <button
              className="border-windows bg-secondary active:border-windows-inverted px-3 whitespace-nowrap"
              onClick={() => send({ t: 'stand' })}
              type="button"
            >
              Stand up
            </button>
          )}
          {/* Nobody came: swap to the Computer's table. */}
          {myTable &&
            myTable.id !== PC_TABLE &&
            !full(myTable.id) &&
            !pcSeat && (
              <button
                className="border-windows bg-secondary active:border-windows-inverted px-3 whitespace-nowrap"
                onClick={() => {
                  send({ t: 'stand' });
                  walkTo(TABLES[PC_TABLE].seats[0], {
                    tableId: PC_TABLE,
                    seat: 0,
                  });
                }}
                type="button"
              >
                Play the computer
              </button>
            )}
          <button
            className="border-windows bg-secondary active:border-windows-inverted px-3"
            onClick={() => {
              send({ t: 'stand' }); // a closed socket alone would hold the seat
              useRoomStore.getState().disconnect();
            }}
            type="button"
          >
            Leave
          </button>
        </Chat>
        {viewing !== null && BOARD}
        {help && <HowToPlay close={() => setHelp(false)} />}
      </div>
    </div>
  );
}
