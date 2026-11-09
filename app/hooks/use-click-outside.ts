import { type RefObject, useEffect, useRef } from 'react';

export const useClickOutside = (
  ref: RefObject<HTMLDivElement | null>,
  callback: () => void
) => {
  // Latest callback in a ref, so the listener is added once, not every render.
  const cb = useRef(callback);
  cb.current = callback;

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as HTMLElement))
        cb.current();
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [ref]);
};
