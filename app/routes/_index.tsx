import { useContext } from 'react';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';
import WindowButton from '~/components/WindowButton';
import { WindowContext } from '~/contexts/WindowContext';

export default function BrowserIndex() {
  const {
    windows,
    closeWindow,
    minimizeWindow,
    restoreWindow,
    maximizeWindow,
    setWindowPosition,
  } = useContext(WindowContext);

  const browserIndex = windows.find((window) => window.id === 'BrowserIndex');

  const handleDrag = (e: DraggableEvent, data: DraggableData) => {
    if (!browserIndex?.isMinimized) {
      setWindowPosition('BrowserIndex', { x: data.x, y: data.y });
    }
  };

  const handleMinimize = () => {
    minimizeWindow('BrowserIndex');
  };
  const toggleMaximize = () => {
    if (browserIndex?.isMaximized) {
      restoreWindow('BrowserIndex');
      setWindowPosition('BrowserIndex', { x: 200, y: 100 }); // Restore to default window position
    } else {
      maximizeWindow('BrowserIndex');
      setWindowPosition('BrowserIndex', { x: 0, y: 0 }); // Set position to top-left corner when maximized
    }
  };

  const handleClose = () => {
    closeWindow('BrowserIndex');
  };

  return browserIndex?.isMinimized ? null : (
    <Draggable
      handle=".handle"
      position={
        browserIndex?.isMinimized ? { x: 0, y: 0 } : browserIndex?.position
      }
      onDrag={handleDrag}
      disabled={browserIndex?.isMinimized}
    >
      <div
        className={`absolute flex flex-col border-2 border-windows-white bg-windows-gray-primary shadow-md ${
          browserIndex?.isMaximized
            ? 'left-0 top-0 h-full w-full'
            : 'h-3/4 w-3/4'
        } ${browserIndex?.isMinimized ? '' : 'resize overflow-auto'}`}
        onDoubleClick={toggleMaximize}
      >
        {/* Title bar */}
        <div className="handle flex h-6 items-center justify-between bg-windows-blue px-1 text-windows-white [&:active]:cursor-move">
          <div className="flex items-center">
            <img
              src="/html-0.png"
              alt="Browser icon"
              className="mr-1 h-4 w-4"
            />
            <span className="font-micro text-xl">Portfolio Hub</span>
          </div>
          <div className="flex items-center">
            <WindowButton
              onClick={handleMinimize}
              imageName="/minimize.png"
              imageAlt="Minimize"
            />
            <WindowButton
              onClick={toggleMaximize}
              imageName="/maximize.png"
              imageAlt="Maximize"
            />
            <WindowButton
              onClick={handleClose}
              imageName="/close.png"
              imageAlt="Close"
            />
          </div>
        </div>

        {/* Content area with padding and shadow */}
        <div className="flex-grow bg-windows-gray-primary p-1 shadow-inner">
          <div className="h-full overflow-auto bg-windows-white p-4">
            <h1 className="mb-4 text-2xl font-bold">Welcome to Ppconde OS</h1>
            <p className="mb-2">
              This is a simulated Windows 98-style browser window.
            </p>
            <p>Explore the desktop icons and start menu for more features!</p>
          </div>
        </div>

        {/* Status bar */}
        <div className="flex h-5 items-center justify-between border-t border-gray-600 bg-windows-gray-primary px-2 text-xs">
          <span className="flex items-center">
            <img
              src="/html-0.png"
              alt="Internet icon"
              className="mr-1 h-4 w-4"
            />
            Done
          </span>
          <span className="flex items-center">
            <img
              src="/world-1.png"
              alt="Internet icon"
              className="mr-1 h-4 w-4"
            />
            Internet
          </span>
        </div>
      </div>
    </Draggable>
  );
}
