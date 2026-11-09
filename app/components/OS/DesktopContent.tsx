import { useEffect } from 'react';
import { Outlet } from 'react-router';
import { AppsNames } from '~/constants/apps-names.const';
import { icons } from '~/constants/icons.const';
import { usePlaySound } from '~/hooks/use-play-sounds';
import { useWindowsStore } from '~/store/WindowsStore';
import Credits from '../Credits';
import MancalaLounge from '../MancalaLounge';
import Paint from '../Paint';
import Icon from './Icon';
import Navbar from './Navbar';
import OSWindow from './OSWindow';

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
          <Icon key={icon.label} {...icon} />
        ))}
      </div>
      {windows.map((window) => (
        <OSWindow
          key={window.id}
          showStatusBar={window.id === AppsNames.PORTFOLIO}
          window={window}
        >
          {(() => {
            switch (window.id) {
              case AppsNames.PORTFOLIO:
                return <Outlet />;
              case AppsNames.CREDITS:
                return <Credits />;
              case AppsNames.PAINT:
                return <Paint />;
              case AppsNames.MANCALA:
                return <MancalaLounge />;
              default:
                return null;
            }
          })()}
        </OSWindow>
      ))}
      <Navbar />
    </div>
  );
}
