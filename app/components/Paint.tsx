import classNames from 'classnames';
import { useEffect, useRef, useState } from 'react';

const COLORS = [
  '#000000', '#808080', '#800000', '#808000', '#008000', '#008080', '#000080', '#800080',
  '#ffffff', '#c0c0c0', '#ff0000', '#ffff00', '#00ff00', '#00ffff', '#0000ff', '#ff00ff',
]; // biome-ignore format: palette grid
const MAX_UNDO = 20;
const SIZES = [1, 3, 6, 10];
const TOOLS = ['Pencil', 'Eraser', 'Fill'] as const;
type Tool = (typeof TOOLS)[number];

// Flood fill from (x, y) with an RGBA colour. Exact-match, 4-way, scanline stack.
function floodFill(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  hex: string,
  w: number,
  h: number
) {
  const img = ctx.getImageData(0, 0, w, h);
  const px = new Uint32Array(img.data.buffer);
  const n = Number.parseInt(hex.slice(1), 16);
  // Little-endian RGBA packed as ABGR.
  const fill = (0xff << 24) | ((n & 0xff) << 16) | (n & 0xff00) | (n >> 16);
  const target = px[y * w + x];
  if (target === fill >>> 0) return;
  const stack = [y * w + x];
  while (stack.length) {
    const i = stack.pop() as number;
    if (px[i] !== target) continue;
    px[i] = fill;
    const cx = i % w;
    if (cx > 0) stack.push(i - 1);
    if (cx < w - 1) stack.push(i + 1);
    if (i >= w) stack.push(i - w);
    if (i < w * (h - 1)) stack.push(i + w);
  }
  ctx.putImageData(img, 0, 0);
}

export default function Paint() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const viewRef = useRef<HTMLDivElement>(null);
  // ponytail: full snapshots of the visible area, capped; diff-based history if memory bites.
  const history = useRef<ImageData[]>([]);
  const last = useRef<{ x: number; y: number } | null>(null);
  const [tool, setTool] = useState<Tool>('Pencil');
  const [color, setColor] = useState('#000000');
  const [size, setSize] = useState(3);

  const ctx = () =>
    canvasRef.current?.getContext('2d', { willReadFrequently: true });
  // Every edit happens inside the visible area, so that's all undo needs to keep.
  const visible = () => {
    const c = canvasRef.current;
    const v = viewRef.current;
    return {
      w: Math.min(c?.width ?? 0, v?.clientWidth ?? 0),
      h: Math.min(c?.height ?? 0, v?.clientHeight ?? 0),
    };
  };
  const snapshot = () => {
    const c = ctx();
    const { w, h } = visible();
    if (!c || !w || !h) return;
    history.current.push(c.getImageData(0, 0, w, h));
    if (history.current.length > MAX_UNDO) history.current.shift();
  };
  const undo = () => {
    const img = history.current.pop();
    if (img) ctx()?.putImageData(img, 0, 0);
  };
  const clear = () => {
    const c = ctx();
    if (!c) return;
    snapshot();
    c.fillStyle = '#ffffff';
    c.fillRect(0, 0, c.canvas.width, c.canvas.height);
  };

  // The canvas grows with the window but never shrinks: shrinking only clips the
  // view, so maximize → restore doesn't throw away what was drawn.
  useEffect(() => {
    const view = viewRef.current;
    const c = canvasRef.current?.getContext('2d', { willReadFrequently: true });
    if (!view || !c) return;
    const fit = () => {
      const { width, height } = c.canvas;
      const w = Math.max(width, view.clientWidth);
      const h = Math.max(height, view.clientHeight);
      if (w === width && h === height) return;
      const old = c.getImageData(0, 0, width, height);
      c.canvas.width = w;
      c.canvas.height = h;
      c.fillStyle = '#ffffff';
      c.fillRect(0, 0, w, h);
      c.putImageData(old, 0, 0);
    };
    // Start white (a fresh canvas is transparent).
    c.fillStyle = '#ffffff';
    c.fillRect(0, 0, c.canvas.width, c.canvas.height);
    const ro = new ResizeObserver(fit);
    ro.observe(view);
    return () => ro.disconnect();
  }, []);

  // Clamped to the visible area: a drag past the edge mustn't paint the hidden
  // part of the canvas, where undo can't reach.
  const point = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const { w, h } = visible();
    const clamp = (v: number, max: number) =>
      Math.max(0, Math.min(Math.floor(v), max - 1));
    return {
      x: clamp(((e.clientX - r.left) * e.currentTarget.width) / r.width, w),
      y: clamp(((e.clientY - r.top) * e.currentTarget.height) / r.height, h),
    };
  };

  const stroke = (
    from: { x: number; y: number },
    to: { x: number; y: number }
  ) => {
    const c = ctx();
    if (!c) return;
    c.strokeStyle = tool === 'Eraser' ? '#ffffff' : color;
    c.lineWidth = tool === 'Eraser' ? size * 3 : size;
    c.lineCap = c.lineJoin = 'round';
    c.beginPath();
    c.moveTo(from.x + 0.5, from.y + 0.5);
    c.lineTo(to.x + 0.5, to.y + 0.5);
    c.stroke();
  };

  const onDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (e.button !== 0) return;
    const p = point(e);
    snapshot();
    if (tool === 'Fill') {
      const c = ctx();
      const { w, h } = visible();
      if (c) floodFill(c, p.x, p.y, color, w, h);
      return;
    }
    e.currentTarget.setPointerCapture(e.pointerId);
    last.current = p;
    stroke(p, p);
  };
  const onMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!last.current) return;
    const p = point(e);
    stroke(last.current, p);
    last.current = p;
  };
  const onUp = () => {
    last.current = null;
  };

  // Saves what's on screen, not the hidden part of a canvas that grew earlier.
  const save = () => {
    const src = canvasRef.current;
    if (!src) return;
    const { w, h } = visible();
    const out = document.createElement('canvas');
    out.width = w;
    out.height = h;
    out.getContext('2d')?.drawImage(src, 0, 0);
    const a = document.createElement('a');
    a.href = out.toDataURL('image/png');
    a.download = 'untitled.png';
    a.click();
  };

  const btn = (active: boolean) =>
    classNames(
      'flex h-7 items-center justify-center px-1 text-xs',
      active ? 'btn-windows-inverted' : 'btn-windows'
    );

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: Ctrl+Z inside the Paint window; the Undo button is the accessible equivalent
    <div
      className="bg-secondary -m-4 flex h-[calc(100%+2rem)] flex-col text-xs outline-none"
      onKeyDown={(e) => {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
          e.preventDefault();
          undo();
        }
      }}
      tabIndex={-1}
    >
      <div className="flex gap-1 p-1">
        <button className={btn(false)} onClick={clear} type="button">
          New
        </button>
        <button className={btn(false)} onClick={save} type="button">
          Save
        </button>
        <button className={btn(false)} onClick={undo} type="button">
          Undo
        </button>
      </div>
      <div className="flex min-h-0 grow gap-1 p-1">
        <div className="flex w-16 shrink-0 flex-col gap-1">
          {TOOLS.map((t) => (
            <button
              aria-pressed={tool === t}
              className={btn(tool === t)}
              key={t}
              onClick={() => setTool(t)}
              type="button"
            >
              {t}
            </button>
          ))}
          <div className="border-windows-sunken mt-1 flex flex-col gap-1 border p-1">
            {SIZES.map((s) => (
              <button
                aria-label={`Size ${s}`}
                aria-pressed={size === s}
                className={classNames('flex h-5 items-center justify-center', {
                  'bg-accent': size === s,
                })}
                key={s}
                onClick={() => setSize(s)}
                type="button"
              >
                <span
                  className={size === s ? 'bg-tertiary' : 'bg-black'}
                  style={{ width: '80%', height: Math.min(s, 8) }}
                />
              </button>
            ))}
          </div>
        </div>
        <div className="border-windows-sunken grow border-2">
          <div className="relative h-full overflow-hidden" ref={viewRef}>
            <canvas
              className="absolute top-0 left-0 cursor-crosshair touch-none"
              data-testid="paint-canvas"
              onPointerCancel={onUp}
              onPointerDown={onDown}
              onPointerMove={onMove}
              onPointerUp={onUp}
              ref={canvasRef}
            />
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 p-1">
        <div
          aria-label="Current colour"
          className="border-windows-sunken h-8 w-8 shrink-0 border-2"
          role="img"
          style={{ background: color }}
        />
        <div className="grid grid-cols-8 gap-px">
          {COLORS.map((c) => (
            <button
              aria-label={c}
              aria-pressed={color === c}
              className="border-windows-sunken h-4 w-4 border"
              key={c}
              onClick={() => setColor(c)}
              style={{ background: c }}
              type="button"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
