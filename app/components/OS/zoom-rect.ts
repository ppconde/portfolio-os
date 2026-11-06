// Win98 window zoom: a dotted outline that steps from one rect to another.
export function zoomRect(from: DOMRect, to: DOMRect) {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const el = document.createElement('div');
  el.setAttribute('aria-hidden', 'true');
  el.style.cssText =
    'position:fixed;left:0;top:0;border:2px dotted #fff;mix-blend-mode:difference;pointer-events:none;z-index:99999';
  document.body.append(el);
  const frame = (r: DOMRect) => ({
    transform: `translate(${r.left}px, ${r.top}px)`,
    width: `${r.width}px`,
    height: `${r.height}px`,
  });
  el.animate([frame(from), frame(to)], {
    duration: 180,
    easing: 'steps(6, end)',
  }).onfinish = () => el.remove();
}
