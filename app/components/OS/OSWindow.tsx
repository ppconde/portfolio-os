import classNames from 'classnames';
import { useLayoutEffect, useRef } from 'react';
import Draggable, {
  type DraggableData,
  type DraggableEvent,
} from 'react-draggable';
import { icons } from '~/constants/icons.const';
import { type DesktopWindow, useWindowsStore } from '~/store/WindowsStore';
import WindowButton from './WindowButton';
import { zoomRect } from './zoom-rect';

type OSWindowProps = {
  window: DesktopWindow;
  children: React.ReactNode;
  showStatusBar?: boolean;
};

export default function OSWindow({
  window,
  children,
  showStatusBar = false,
}: OSWindowProps) {
  const {
    closeWindow,
    minimizeWindow,
    restoreWindow,
    maximizeWindow,
    setWindowPosition,
  } = useWindowsStore.getState(); // actions are stable; no need to subscribe

  // biome-ignore lint/style/noNonNullAssertion: <It needs to be non-null because it is used in the Draggable component>
  const nodeRef = useRef<HTMLDivElement>(null!);

  // Zoom outline on open, minimize, restore and maximize, from the last
  // on-screen rect (or the taskbar button) to the new one.
  const last = useRef<{ rect?: DOMRect; min?: boolean; max?: boolean }>({});
  useLayoutEffect(() => {
    const rect = nodeRef.current?.getBoundingClientRect();
    const prev = last.current;
    const taskbar = document
      .querySelector(`[data-taskbar-button="${window.id}"]`)
      ?.getBoundingClientRect();
    const from = window.isMinimized || !prev.rect ? taskbar : prev.rect;
    const to = window.isMinimized ? taskbar : rect;
    if (
      from &&
      to &&
      (prev.min !== window.isMinimized || prev.max !== window.isMaximized)
    )
      zoomRect(from, to);
    last.current = {
      rect: rect ?? prev.rect,
      min: window.isMinimized,
      max: window.isMaximized,
    };
  });

  const handleDragStop = (_event: DraggableEvent, data: DraggableData) => {
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

  return window.isMinimized ? null : (
    <Draggable
      bounds="parent"
      disabled={window.isMaximized}
      handle=".handle"
      nodeRef={nodeRef}
      onMouseDown={() => setWindowPosition(window.id)}
      onStop={handleDragStop}
      position={window.isMinimized ? { x: 0, y: 0 } : window.position}
    >
      {/** biome-ignore lint/a11y/noStaticElementInteractions: <This is an unusual behavior because we are mimicking a windowing system> */}
      <div
        className={classNames(
          'border-windows bg-secondary absolute flex flex-col shadow-md',
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
              'handle text-tertiary flex h-6 items-center justify-between px-1',
              { 'active:cursor-move': !window.isMaximized },
              window.isFocused ? 'bg-accent' : 'bg-quaternary'
            )}
          >
            <div className="flex items-center">
              <img
                alt=""
                className="mr-1 h-4 w-4"
                src={icons.find((icon) => icon.app === window.id)?.icon}
              />
              <span className="font-micro overflow-hidden text-xl whitespace-nowrap">
                {window.id}
              </span>
            </div>
            <div className="flex items-center">
              <WindowButton
                data-testid={`minimize-button-${window.id.toLowerCase()}`}
                imageAlt="Minimize"
                imageName="/assets/minimize.png"
                onClick={handleMinimize}
              />
              <WindowButton
                data-testid={`maximize-button-${window.id.toLowerCase()}`}
                imageAlt="Maximize"
                imageName="/assets/maximize.png"
                onClick={toggleMaximize}
              />
              <WindowButton
                data-testid={`close-button-${window.id.toLowerCase()}`}
                imageAlt="Close"
                imageName="/assets/close.png"
                onClick={handleClose}
              />
            </div>
          </div>
        </div>

        {/* Content area */}
        <div className="no-scrollbar bg-secondary grow overflow-y-scroll p-1">
          {/* White Area */}
          <div className="border-windows-sunken bg-tertiary shadow-windows-inset h-full border-2 p-4">
            {children}
          </div>
        </div>

        {/* Status bar */}
        {showStatusBar && (
          <div className="bg-secondary flex gap-0.5 p-1 text-xs">
            <span className="border-windows-sunken flex h-5 min-w-0 grow items-center gap-1 border px-1">
              <img
                alt=""
                className="h-4 w-4 shrink-0"
                src="/assets/html-0.png"
              />
              <span className="truncate">
                © {new Date().getFullYear()} Pedro Conde
              </span>
            </span>
            <span className="border-windows-sunken flex h-5 shrink-0 items-center gap-1 border px-1 whitespace-nowrap">
              <img alt="" className="h-4 w-4" src="/assets/world-1.png" />
              Internet
            </span>
          </div>
        )}
      </div>
    </Draggable>
  );
}
