import { useBootStore } from '~/store/BootStore';
import BiosScreen from './BiosScreen';
import DesktopContent from './DesktopContent';
import ShutdownScreen from './ShutdownScreen';

export function Screen() {
  const bootState = useBootStore((s) => s.bootState);

  switch (bootState) {
    case 'booting':
      return <BiosScreen />;
    case 'loaded':
      return <DesktopContent />;
    case 'shutting_down':
      return <ShutdownScreen />;
  }
}
