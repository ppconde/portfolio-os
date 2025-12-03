import { useWindowsStore } from '~/store/WindowsStore';
import NavBarButton from './NavBarButton';
import Start from './Start';
import VerticalSeparator from './VerticalSeparator';
import Clock from './Clock';

export default function Navbar() {
  const windows = useWindowsStore((s) => s.windows);

  return (
    <nav className="border-tertiary bg-secondary fixed bottom-0 left-0 z-9999 flex h-8 w-full items-center justify-center border-t-2 px-1">
      <Start />
      <VerticalSeparator />
      <div className="flex h-[80%] basis-1/6 items-center">
        {windows.map((window, index) => (
          <NavBarButton key={window.id + index} window={window} />
        ))}
      </div>
      <div className="grow" />
      <VerticalSeparator />
      <Clock />
    </nav>
  );
}
