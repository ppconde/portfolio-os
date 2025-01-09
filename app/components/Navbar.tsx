import { useContext } from 'react';
import { WindowsContext } from '~/contexts/WindowsContext';
import NavBarButton from './NavBarButton';
import Start from './Start';
import VerticalSeparator from './VerticalSeparator';
import Clock from './Clock';

export default function Navbar() {
  const { windows } = useContext(WindowsContext);

  return (
    <nav className="fixed bottom-0 left-0 flex h-8 w-full items-center justify-center border-t-2 border-windows-white bg-windows-gray-primary px-1">
      <div className="h-[80%] min-w-20 pr-1">
        <Start />
      </div>
      <VerticalSeparator />
      <div className="flex h-[80%] items-center">
        {windows.map((window, index) => (
          <NavBarButton key={window.id + index} window={window} />
        ))}
      </div>
      <div className="w-full flex-grow" />
      <VerticalSeparator />
      <Clock />
    </nav>
  );
}
