import { useEffect } from 'react';

const MODIFIERS = ['Tab', 'Shift', 'Control', 'Alt', 'Meta'];

// "Press any key": fires on a real key press, ignoring modifiers and shortcuts.
export function useAnyKey(onKey: () => void) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || MODIFIERS.includes(e.key)) return;
      onKey();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onKey]);
}
