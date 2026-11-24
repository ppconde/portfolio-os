import { TABLES, TILE } from '~/room';
import { type Blob, seatName, useRoomStore } from '~/store/RoomStore';

// Breath and eye timings from a stable hash of the id, so blobs idle out of step.
const clocks = (id: string) => {
  const s = [...id].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);
  return [
    {
      animationDuration: `${2.2 + (s % 7) / 10}s`,
      animationDelay: `-${s % 3}s`,
    },
    {
      animationDuration: `${6 + (s % 50) / 10}s`,
      animationDelay: `-${(s >> 4) % 11}s`,
    },
  ];
};

// Subscribes to players itself, so a walking tick redraws the blobs, not the room.
export default function Blobs() {
  const players = useRoomStore((s) => s.players);
  const tables = useRoomStore((s) => s.tables);
  const you = useRoomStore((s) => s.you);
  // The resident Computer is drawn as a blob too.
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
  const seats = new Map(
    tables.flatMap((t) => t.seats.flatMap((s) => (s ? [[s.id, s]] : [])))
  );
  // Drawn back to front by where they touch the floor.
  const sorted: Blob[] = [...Object.values(players), ...computers].sort(
    (a, b) => a.y - b.y
  );

  return (
    <>
      {sorted.map((p) => {
        const seat = seats.get(p.id);
        const [idle, eyes] = clocks(p.id);
        // Walking: eyes point where they're headed; stopped, they wander.
        const walking = Date.now() - (p.movedAt ?? 0) < 300 && p.look;
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
                  <rect fill="#0f172a" height="11" width="18" x="-9" y="-17" />
                  <g className="blob-eyes" style={eyes}>
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
                  </g>
                </>
              ) : (
                <g className="blob-idle" style={idle}>
                  <ellipse
                    cx="0"
                    cy="-10"
                    fill={p.color}
                    rx="11"
                    ry="10"
                    stroke="#00000066"
                  />
                  <g
                    className="blob-eyes"
                    style={
                      walking
                        ? {
                            animation: 'none',
                            transform: `translate(${walking.x * 2.5}px, ${walking.y * 2}px)`,
                          }
                        : eyes
                    }
                  >
                    {[-4, 4].map((ex) => (
                      <circle cx={ex} cy={-12} fill="#111" key={ex} r="1.6" />
                    ))}
                  </g>
                </g>
              )}
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
    </>
  );
}
