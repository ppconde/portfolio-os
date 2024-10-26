import { useContext } from 'react';
import { WindowContext } from '~/contexts/WindowContext';
import NavBarButton from '~/components/NavBarButton';
import Start from '~/components/Start';

export default function Navbar() {
  const { windows } = useContext(WindowContext);
  return (
    <nav className="fixed bottom-0 left-0 flex h-8 w-full items-center justify-center border-t-2 border-windows-white bg-windows-gray-primary px-1">
      <div className="h-[80%] pr-1">
        <Start />
      </div>
      <div className="h-[90%] w-px bg-windows-gray-secondary" />
      <div className="h-[90%] w-px bg-windows-white" />
      <div className="flex h-[80%] flex-1 items-center">
        {windows.map((window, index) => (
          <NavBarButton key={window.id + index} window={window} />
        ))}
      </div>
    </nav>
  );
}
