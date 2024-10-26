import { useContext, useRef } from 'react';
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

  const handleDrag = (_event: DraggableEvent, data: DraggableData) => {
    if (!browserIndex?.isMaximized) {
      setWindowPosition('BrowserIndex', { x: data.x, y: data.y });
    }
  };

  const handleMinimize = () => {
    minimizeWindow('BrowserIndex');
  };
  const toggleMaximize = () => {
    if (browserIndex?.isMaximized) {
      restoreWindow('BrowserIndex');
      setWindowPosition('BrowserIndex', { x: 100, y: 100 }); // Restore to default window position
    } else {
      maximizeWindow('BrowserIndex');
      setWindowPosition('BrowserIndex', { x: 0, y: 0 }); // Set position to top-left corner when maximized
    }
  };

  const handleClose = () => {
    closeWindow('BrowserIndex');
  };

  const nodeRef = useRef(null);

  return browserIndex?.isMinimized ? null : (
    <Draggable
      nodeRef={nodeRef}
      handle=".handle"
      position={
        browserIndex?.isMinimized ? { x: 0, y: 0 } : browserIndex?.position
      }
      onDrag={handleDrag}
      disabled={browserIndex?.isMaximized}
    >
      <div
        ref={nodeRef}
        className={`absolute flex flex-col border-2 border-b-black border-l-windows-white border-r-black border-t-windows-white bg-windows-gray-primary shadow-md ${
          browserIndex?.isMaximized
            ? 'bottom-8 left-0 right-0 top-0'
            : 'h-3/4 w-3/4'
        } ${browserIndex?.isMinimized ? '' : 'resize overflow-auto'}`}
        onDoubleClick={toggleMaximize}
      >
        {/* Title bar */}
        <div className="bg-windows-gray-primary p-1">
          <div
            className={`handle flex h-6 items-center justify-between bg-windows-blue px-1 text-windows-white ${browserIndex?.isMaximized ? '' : '[&:active]:cursor-move'} `}
          >
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
        </div>

        {/* Content area */}
        <div className="flex-grow bg-windows-gray-primary p-1">
          {/* White Area */}
          <div className="shadow-windows-inset h-full overflow-auto border-2 border-b-windows-white border-l-windows-gray-secondary border-r-windows-white border-t-windows-gray-secondary bg-windows-white p-4">
            <h1 className="mb-4 text-2xl font-bold">Welcome to Ppconde OS</h1>
            <p className="mb-2">
              This is a simulated Windows 98-style browser window.
            </p>
            <p>Explore the desktop icons and start menu for more features!</p>
          </div>
        </div>

        {/* Status bar */}
        <div className="bg-windows-gray-primary p-1 text-xs">
          <div className="flex h-5 items-center justify-between border border-b-windows-white border-l-windows-gray-secondary border-r-windows-white border-t-windows-gray-secondary p-1">
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
      </div>
    </Draggable>
  );
}
