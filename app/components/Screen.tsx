import { Outlet } from 'react-router';
import { useBootContext } from '~/contexts/BootContext';
import { WindowProvider } from '~/contexts/WindowsContext';
import BiosScreen from './BiosScreen';
import Icon from './Icon';
import Navbar from './Navbar';
import ShutdownScreen from './ShutdownScreen';

export function Screen() {
  const { bootState } = useBootContext();

  switch (bootState) {
    case 'booting':
      return <BiosScreen />;
    case 'loaded':
      return (
        <WindowProvider>
          <div className="relative flex h-screen w-screen select-none flex-col overflow-hidden bg-windows-teal">
            <div className="relative flex flex-col gap-6 p-4">
              <Icon
                name="My Portfolio"
                icon="/assets/accesibility_window_abc.png"
                to="/website"
              />
            </div>
            <Outlet />
            <Navbar />
          </div>
        </WindowProvider>
      );
    case 'shutting_down':
      return <ShutdownScreen />;
  }
}
