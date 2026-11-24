import { lazy, Suspense, useEffect } from 'react';
import { Outlet } from 'react-router';
import { AppsNames } from '~/constants/apps-names.const';
import { icons, loadMancala, loadPaint } from '~/constants/icons.const';
import { usePlaySound } from '~/hooks/use-play-sounds';
import { useWindowsStore } from '~/store/WindowsStore';
import Credits from '../Credits';
import Icon from './Icon';
import Navbar from './Navbar';
import OSWindow from './OSWindow';

// Loaded when the Mancala window first opens, not with the desktop.
const MancalaLounge = lazy(loadMancala);
const Paint = lazy(loadPaint);

// Module-level elements keep their identity, so window focus/drag re-renders
// skip the apps. <Outlet /> still updates on navigation (it reads context).
const APPS: Record<AppsNames, React.ReactNode> = {
  [AppsNames.PORTFOLIO]: <Outlet />,
  [AppsNames.CREDITS]: <Credits />,
  [AppsNames.PAINT]: (
    <Suspense fallback={null}>
      <Paint />
    </Suspense>
  ),
  [AppsNames.MANCALA]: (
    <Suspense fallback={<div className="h-full bg-[#2b1612]" />}>
      <MancalaLounge />
    </Suspense>
  ),
};

export default function DesktopContent() {
  const windows = useWindowsStore((s) => s.windows);
  usePlaySound('/audio/windows98-click.mp3');

  // Phones: start the portfolio maximized so it isn't squeezed beside the icons.
  useEffect(() => {
    if (!matchMedia('(max-width: 639px)').matches) return;
    const { maximizeWindow, setWindowPosition } = useWindowsStore.getState();
    maximizeWindow(AppsNames.PORTFOLIO);
    setWindowPosition(AppsNames.PORTFOLIO, { x: 0, y: 0 });
  }, []);

  return (
    <div className="bg-primary relative flex h-screen w-screen flex-col overflow-hidden select-none">
      <div className="relative flex flex-col gap-6 p-4">
        {icons.map((icon) => (
          <Icon key={icon.app} {...icon} />
        ))}
      </div>
      {windows.map((window) => (
        <OSWindow
          key={window.id}
          showStatusBar={window.id === AppsNames.PORTFOLIO}
          window={window}
        >
          {APPS[window.id]}
        </OSWindow>
      ))}
      <Navbar />
    </div>
  );
}
