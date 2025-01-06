import { useContext, useRef } from 'react';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';
import WindowButton from '~/components/WindowButton';
import { WindowsContext, DesktopWindow } from '~/contexts/WindowsContext';

interface OSWindowProps {
  window: DesktopWindow;
  children: React.ReactNode;
}

export default function OSWindow({ window, children }: OSWindowProps) {
  const {
    closeWindow,
    minimizeWindow,
    restoreWindow,
    maximizeWindow,
    setWindowPosition,
  } = useContext(WindowsContext);

  const handleDrag = (_event: DraggableEvent, data: DraggableData) => {
    if (!window.isMaximized) {
      setWindowPosition(window.id, { x: data.x, y: data.y });
    }
  };

  const handleMinimize = () => {
    minimizeWindow(window.id);
  };
  const toggleMaximize = () => {
    if (window.isMaximized) {
      restoreWindow(window.id);
      setWindowPosition(window.id, { x: 100, y: 100 }); // Restore to default window position
    } else {
      // Hacky way to remove inline styles from Draggable component
      nodeRef.current.style.cssText = '';
      maximizeWindow(window.id);
      setWindowPosition(window.id, { x: 0, y: 0 }); // Set position to top-left corner when maximized
    }
  };

  const handleClose = () => {
    closeWindow(window.id);
  };

  const nodeRef = useRef<HTMLDivElement>(null!);

  return window.isMinimized ? null : (
    <Draggable
      nodeRef={nodeRef}
      handle=".handle"
      position={window.isMinimized ? { x: 0, y: 0 } : window.position}
      onDrag={handleDrag}
      disabled={window.isMaximized}
      bounds="parent"
    >
      <div
        ref={nodeRef}
        className={`absolute flex flex-col border-2 border-b-black border-l-windows-white border-r-black border-t-windows-white bg-windows-gray-primary shadow-md ${
          window.isMaximized ? 'bottom-8 left-0 right-0 top-0' : 'h-3/4 w-3/4'
        } ${window.isMinimized || window.isMaximized ? '' : 'resize overflow-auto'}`}
        onDoubleClick={toggleMaximize}
      >
        {/* Title bar */}
        <div className="bg-windows-gray-primary p-1">
          <div
            className={`handle flex h-6 items-center justify-between bg-windows-blue px-1 text-windows-white ${window.isMaximized ? '' : '[&:active]:cursor-move'} `}
          >
            <div className="flex items-center">
              <img
                src="/assets/html-0.png"
                alt="Browser icon"
                className="mr-1 h-4 w-4"
              />
              <span className="overflow-hidden whitespace-nowrap font-micro text-xl">
                My Portfolio
              </span>
            </div>
            <div className="flex items-center">
              <WindowButton
                onClick={handleMinimize}
                imageName="/assets/minimize.png"
                imageAlt="Minimize"
              />
              <WindowButton
                onClick={toggleMaximize}
                imageName="/assets/maximize.png"
                imageAlt="Maximize"
              />
              <WindowButton
                onClick={handleClose}
                imageName="/assets/close.png"
                imageAlt="Close"
              />
            </div>
          </div>
        </div>

        {/* Content area */}
        <div className="no-scrollbar no-scrollbar flex-grow overflow-y-scroll bg-windows-gray-primary p-1">
          {/* White Area */}
          <div className="h-full border-2 border-b-windows-white border-l-windows-gray-secondary border-r-windows-white border-t-windows-gray-secondary bg-windows-white p-4 shadow-windows-inset">
            {children}
          </div>
        </div>

        {/* Status bar */}
        <div className="bg-windows-gray-primary p-1 text-xs">
          <div className="flex h-5 items-center justify-between border border-b-windows-white border-l-windows-gray-secondary border-r-windows-white border-t-windows-gray-secondary p-1">
            <span className="flex w-1/2 items-center overflow-hidden text-ellipsis whitespace-nowrap">
              <img
                src="/assets/html-0.png"
                alt="Internet icon"
                className="mr-1 h-4 w-4"
              />
              © {new Date().getFullYear()} Portfolio. All rights reserved.
            </span>
            <span className="flex items-center">
              <img
                src="/assets/world-1.png"
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
