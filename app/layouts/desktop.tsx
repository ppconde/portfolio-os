import Icon from '~/components/Icon';
import Navbar from '~/components/Navbar';
import { Outlet } from 'react-router';

export default function Desktop() {
  return (
    <div className="relative flex h-screen w-screen flex-col overflow-hidden bg-windows-teal">
      <div className="relative flex flex-col gap-4 p-4">
        <Icon
          name="My Portfolio"
          icon="/assets/accesibility_window_abc.png"
          to="/website"
        />
      </div>
      <Outlet />
      <Navbar />
    </div>
  );
}
