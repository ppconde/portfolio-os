import classNames from 'classnames';
import { useRef } from 'react';
import Draggable, {
  type DraggableData,
  type DraggableEvent,
} from 'react-draggable';
import { icons } from '~/constants/icons.const';
import { type DesktopWindow, useWindowsStore } from '~/store/WindowsStore';
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

  // biome-ignore lint/style/noNonNullAssertion: <It needs to be non-null because it is used in the Draggable component>
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
      bounds="parent"
      disabled={window.isMaximized}
      handle=".handle"
      nodeRef={nodeRef}
      onDrag={handleDrag}
      onMouseDown={handleOnMouseDown}
      position={window.isMinimized ? { x: 0, y: 0 } : window.position}
    >
      {/** biome-ignore lint/a11y/noStaticElementInteractions: <This is an unusual behavior because we are mimicking a windowing system> */}
      <div
        className={classNames(
          'absolute flex flex-col border-windows bg-secondary shadow-md',
          {
            'resize overflow-auto': !window.isMinimized && !window.isMaximized,
          },
          window.isMaximized ? 'top-0 right-0 bottom-8 left-0' : 'h-4/5 w-4/5'
        )}
        onDoubleClick={toggleMaximize}
        ref={nodeRef}
        style={{ zIndex: window.zIndex }}
      >
        {/* Title bar */}
        <div className="bg-secondary p-1">
          <div
            className={classNames(
              'handle flex h-6 items-center justify-between px-1 text-tertiary',
              { 'active:cursor-move': !window.isMaximized },
              window.isFocused ? 'bg-accent' : 'bg-quaternary'
            )}
          >
            <div className="flex items-center">
              <img
                alt="Browser icon"
                className="mr-1 h-4 w-4"
                src={icons.find((icon) => icon.id === window.name)?.icon}
              />
              <span className="overflow-hidden whitespace-nowrap font-micro text-xl">
                {window.name}
              </span>
            </div>
            <div className="flex items-center">
              <WindowButton
                imageAlt="Minimize"
                imageName="/assets/minimize.png"
                onClick={handleMinimize}
                test-id={`minimize-button-${window.id.toLowerCase()}`}
              />
              <WindowButton
                imageAlt="Maximize"
                imageName="/assets/maximize.png"
                onClick={toggleMaximize}
                test-id={`maximize-button-${window.id.toLowerCase()}`}
              />
              <WindowButton
                imageAlt="Close"
                imageName="/assets/close.png"
                onClick={handleClose}
                test-id={`close-button-${window.id.toLowerCase()}`}
              />
            </div>
          </div>
        </div>

        {/* Content area */}
        <div className="no-scrollbar grow overflow-y-scroll bg-secondary p-1">
          {/* White Area */}
          <div className="h-full border-2 border-t-quaternary border-r-tertiary border-b-tertiary border-l-quaternary bg-tertiary p-4 shadow-windows-inset">
            {children}
          </div>
        </div>

        {/* Status bar */}
        {hideStatusBar && (
          <div className="bg-secondary p-1 text-xs">
            <div className="flex h-5 items-center justify-between border border-t-quaternary border-r-tertiary border-b-tertiary border-l-quaternary p-1">
              <span className="flex grow overflow-hidden text-ellipsis whitespace-nowrap">
                <img
                  alt="Internet icon"
                  className="mr-1 h-4 w-4"
                  src="/assets/html-0.png"
                />
                © {new Date().getFullYear()} Portfolio. All rights reserved.
              </span>
              <span className="flex shrink-0 items-center whitespace-nowrap">
                <img
                  alt="Internet icon"
                  className="mr-1 h-4 w-4"
                  src="/assets/world-1.png"
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
