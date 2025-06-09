import { Outlet } from 'react-router';
import { useWindowsStore } from '~/stores/WindowsStore';
import Icon from './Icon';
import Navbar from './Navbar';
import { AppsNames } from '~/constants/apps-names.const';
import OSWindow from './OSWindow';
import { icons } from '~/constants/icons.const';
import Credits from '../Credits';

export default function DesktopContent() {
  const windows = useWindowsStore((s) => s.windows);

  return (
    <div className="bg-windows-teal relative flex h-screen w-screen flex-col overflow-hidden select-none">
      <div className="relative flex flex-col gap-6 p-4">
        {icons.map((icon) => (
          <Icon key={icon.id} {...icon} />
        ))}
      </div>
      {windows.map((window) => (
        <OSWindow
          key={window.id}
          window={window}
          hideStatusBar={window.id === AppsNames.PORTFOLIO}
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
