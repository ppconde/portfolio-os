import { useRef } from 'react';
import Draggable, {
  type DraggableData,
  type DraggableEvent,
} from 'react-draggable';

import { icons } from '~/constants/icons.const';
import { useWindowsStore, type DesktopWindow } from '~/stores/WindowsStore';
import WindowButton from './WindowButton';

type OSWindowProps = {
  window: DesktopWindow;
  children: React.ReactNode;
  hideStatusBar?: boolean;
};

export default function OSWindow({
  window,
  children,
  hideStatusBar = false,
}: OSWindowProps) {
  const {
    closeWindow,
    minimizeWindow,
    restoreWindow,
    maximizeWindow,
    setWindowPosition,
    onMouseDown,
  } = useWindowsStore();

  const nodeRef = useRef<HTMLDivElement>(null!);

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
      setWindowPosition(window.id, { x: 100, y: 40 }); // Restore to default window position
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

  const handleOnMouseDown = () => {
    onMouseDown(window.id);
  };

  return window.isMinimized ? null : (
    <Draggable
      nodeRef={nodeRef}
      handle=".handle"
      position={window.isMinimized ? { x: 0, y: 0 } : window.position}
      onDrag={handleDrag}
      disabled={window.isMaximized}
      bounds="parent"
      onMouseDown={handleOnMouseDown}
    >
      <div
        ref={nodeRef}
        style={{ zIndex: window.zIndex }}
        className={`border-windows bg-windows-gray-primary absolute flex flex-col shadow-md ${
          window.isMaximized ? 'top-0 right-0 bottom-8 left-0' : 'h-4/5 w-4/5'
        } ${window.isMinimized || window.isMaximized ? '' : 'resize overflow-auto'}`}
        onDoubleClick={toggleMaximize}
      >
        {/* Title bar */}
        <div className="bg-windows-gray-primary p-1">
          <div
            className={`handle bg-windows-blue text-windows-white flex h-6 items-center justify-between px-1 ${window.isMaximized ? '' : 'active:cursor-move'} `}
          >
            <div className="flex items-center">
              <img
                src={icons.find((icon) => icon.id === window.name)?.icon}
                alt="Browser icon"
                className="mr-1 h-4 w-4"
              />
              <span className="font-micro overflow-hidden text-xl whitespace-nowrap">
                {window.name}
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
        <div className="no-scrollbar bg-windows-gray-primary grow overflow-y-scroll p-1">
          {/* White Area */}
          <div className="border-b-windows-white border-l-windows-gray-secondary border-r-windows-white border-t-windows-gray-secondary bg-windows-white shadow-windows-inset h-full border-2 p-4">
            {children}
          </div>
        </div>

        {/* Status bar */}
        {hideStatusBar && (
          <div className="bg-windows-gray-primary p-1 text-xs">
            <div className="border-b-windows-white border-l-windows-gray-secondary border-r-windows-white border-t-windows-gray-secondary flex h-5 items-center justify-between border p-1">
              <span className="flex w-5/6 items-center overflow-hidden text-ellipsis whitespace-nowrap">
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
        )}
      </div>
    </Draggable>
  );
}
