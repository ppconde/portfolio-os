import { useBootContext } from '~/contexts/BootContext';
import BiosScreen from './BiosScreen';
import ShutdownScreen from './ShutdownScreen';
import Desktop from './Desktop';

export function Screen() {
  const { bootState } = useBootContext();

  switch (bootState) {
    case 'booting':
      return <BiosScreen />;
    case 'loaded':
      return <Desktop />;
    case 'shutting_down':
      return <ShutdownScreen />;
  }
}
