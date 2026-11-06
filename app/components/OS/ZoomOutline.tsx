import { useLayoutEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

export type Zoom = { from: DOMRect; to: DOMRect };

const frame = (r: DOMRect) => ({
  transform: `translate(${r.left}px, ${r.top}px)`,
  width: `${r.width}px`,
  height: `${r.height}px`,
});

// Win98 window zoom: a dotted outline that steps from one rect to another.
// Rendered into <body> so no window's stacking or overflow can clip it.
export default function ZoomOutline({
  zoom,
  onDone,
}: {
  zoom: Zoom;
  onDone: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || matchMedia('(prefers-reduced-motion: reduce)').matches) {
      onDone();
      return;
    }
    const animation = el.animate([frame(zoom.from), frame(zoom.to)], {
      duration: 180,
      easing: 'steps(6, end)',
    });
    animation.onfinish = onDone;
    return () => animation.cancel();
  }, [zoom, onDone]);

  return createPortal(
    <div
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-99999 border-2 border-dotted border-white mix-blend-difference"
      ref={ref}
    />,
    document.body
  );
}
