import { Outlet } from 'react-router';
import { AppsNames } from '~/constants/apps-names.const';
import { icons } from '~/constants/icons.const';
import { usePlaySound } from '~/hooks/use-play-sounds';
import { useWindowsStore } from '~/store/WindowsStore';
import Credits from '../Credits';
import Icon from './Icon';
import Navbar from './Navbar';
import OSWindow from './OSWindow';

export default function DesktopContent() {
  const windows = useWindowsStore((s) => s.windows);
  usePlaySound('/audio/windows98-click.mp3');

  return (
    <div className="bg-primary relative flex h-screen w-screen flex-col overflow-hidden select-none">
      <div className="relative flex flex-col gap-6 p-4">
        {icons.map((icon) => (
          <Icon key={icon.id} {...icon} />
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
