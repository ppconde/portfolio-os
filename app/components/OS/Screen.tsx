import { memo, useLayoutEffect, useState } from 'react';
import { useBootStore } from '~/store/BootStore';
import BiosScreen, { session } from './BiosScreen';
import DesktopContent from './DesktopContent';
import ShutdownScreen from './ShutdownScreen';

// memo: framework mode re-renders the root route on every navigation; stop it here.
export const Screen = memo(function Screen() {
  const bootState = useBootStore((s) => s.bootState);
  // The server renders a black screen; the browser picks BIOS or desktop.
  // Runs once per page load, so the reboot after Shut Down always plays the BIOS.
  const [ready, setReady] = useState(false);
  useLayoutEffect(() => {
    if (session.booted()) useBootStore.getState().setBootState('loaded');
    setReady(true);
  }, []);

  if (!ready) return <div className="h-screen w-screen bg-black" />;

  switch (bootState) {
    case 'booting':
      return <BiosScreen />;
    case 'loaded':
      return <DesktopContent />;
    case 'shutting_down':
      return <ShutdownScreen />;
  }
});
