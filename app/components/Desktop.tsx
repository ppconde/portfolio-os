import { Outlet } from 'react-router';
import { WindowProvider } from '~/contexts/WindowsContext';
import Icon from './Icon';
import Navbar from './Navbar';

export default function Desktop() {
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
}
