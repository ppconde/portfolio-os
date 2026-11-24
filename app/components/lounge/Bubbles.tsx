import { COMPUTER, PC_TABLE, TABLES, TILE, type Tile, W } from '~/room';
import { BUBBLE_MS, useRoomStore } from '~/store/RoomStore';

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

// Subscribes to the 1s clock itself, so an idle room only redraws the bubbles.
export default function Bubbles({ computerFree }: { computerFree: boolean }) {
  const players = useRoomStore((s) => s.players);
  const bubbles = useRoomStore((s) => s.bubbles);
  const now = useRoomStore((s) => s.now);
  return (
    <>
      {Object.values(players).map((p) => {
        const b = bubbles[p.id];
        return b && now - b.at < BUBBLE_MS && bubble(p, b.text);
      })}
      {/* The Computer calls out every few seconds while its seat is free. */}
      {computerFree &&
        now % 12_000 < 5_000 &&
        bubble(
          { ...COMPUTER, ...TABLES[PC_TABLE].seats[1] },
          "Anyone for Mancala? I'm the computer!"
        )}
    </>
  );
}
