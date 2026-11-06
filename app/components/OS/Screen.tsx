import { memo } from 'react';
import { useBootStore } from '~/store/BootStore';
import BiosScreen from './BiosScreen';
import DesktopContent from './DesktopContent';
import ShutdownScreen from './ShutdownScreen';
import StartingScreen from './StartingScreen';

// memo: framework mode re-renders the root route on every navigation; stop it here.
export const Screen = memo(function Screen() {
  const bootState = useBootStore((s) => s.bootState);

  switch (bootState) {
    case 'booting':
      return <BiosScreen />;
    case 'starting':
      return <StartingScreen />;
    case 'loaded':
      return <DesktopContent />;
    case 'shutting_down':
      return <ShutdownScreen />;
  }
});
