import { useEffect } from 'react';
import { useBootStore } from '~/store/BootStore';

// The DOS line Win98 prints between the BIOS and the desktop.
export default function StartingScreen() {
  const setBootState = useBootStore((s) => s.setBootState);

  useEffect(() => {
    const id = setTimeout(() => setBootState('loaded'), 1200);
    return () => clearTimeout(id);
  }, [setBootState]);

  return (
    <div className="font-perfect-dos-vga-win h-screen w-screen bg-black p-4 text-lg text-[#aaaaaa] select-none sm:p-8">
      <p role="status">Starting PpcondeOS...</p>
    </div>
  );
}
