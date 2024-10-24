import { useContext } from 'react';
import { WindowContext } from '~/contexts/WindowContext';
import Start from './Start';

export default function Navbar() {
  const { windows, toggleWindow } = useContext(WindowContext);
  return (
    <nav className="fixed bottom-0 left-0 flex h-8 w-full items-center justify-center border-t-2 border-windows-white bg-windows-gray-primary px-1">
      <div className="h-[80%]">
        <Start />
      </div>
      <div className="flex h-[80%] flex-1 items-center">
        {windows.map((window, index) => (
          <>
            {index > 0 && <div className="mx-1 h-[90%] w-px bg-black"></div>}
            <button
              key={window.id}
              className={`relative mx-1 flex h-full items-center p-2 px-2 text-sm ${
                window.isMinimized
                  ? 'border-2 border-b-black border-l-windows-white border-r-black border-t-windows-white bg-windows-gray-primary'
                  : 'flex items-center border-2 border-b-windows-white border-l-black border-r-windows-white border-t-black bg-gray-200 p-2'
              }`}
              onClick={() => toggleWindow(window.id)}
            >
              <div
                className={`pointer-events-none absolute inset-0 border-windows-gray-secondary ${window.isMinimized ? 'border-b border-r' : 'border-l border-t'}`}
              ></div>
              <div className="flex items-center">
                <img
                  src="/html-0.png"
                  alt="Browser icon"
                  className="mr-1 h-3 w-3"
                />
                <span>{window.title}</span>
              </div>
            </button>
          </>
        ))}
      </div>
    </nav>
  );
}
