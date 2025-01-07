import { useContext } from 'react';
import { WindowsContext, DesktopWindow } from '~/contexts/WindowsContext';

export default function NavBarButton({ window }: { window: DesktopWindow }) {
  const { toggleWindow } = useContext(WindowsContext);

  return (
    <button
      key={window.id}
      className={`relative mx-1 flex h-full items-center p-2 text-sm ${
        window.isMinimized
          ? 'btn-windows'
          : 'btn-windows-inverted flex items-center p-2'
      }`}
      onClick={() => toggleWindow(window.id)}
    >
      <div
        className={`pointer-events-none absolute inset-0 border-windows-gray-secondary ${window.isMinimized ? 'border-b border-r' : 'border-l border-t'}`}
      ></div>
      <div className="flex items-center">
        <img
          src="/assets/html-0.png"
          alt="Browser icon"
          className="mr-1 h-3 w-3"
        />
        {/** @TODO Fix this so it stretch the button */}
        <span className="overflow-hidden text-ellipsis whitespace-nowrap">
          {window.id}
        </span>
      </div>
    </button>
  );
}
