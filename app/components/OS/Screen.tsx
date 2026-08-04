import { useBootContext } from '~/contexts/BootContext';
import BiosScreen from './BiosScreen';
import Desktop from './Desktop';
import ShutdownScreen from './ShutdownScreen';

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
