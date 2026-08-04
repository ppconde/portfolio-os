import { Outlet } from 'react-router';
import { AppsNames } from '~/constants/apps-names.const';
import { icons } from '~/constants/icons.const';
import { useWindowsStore } from '~/store/WindowsStore';
import Credits from '../Credits';
import Icon from './Icon';
import Navbar from './Navbar';
import OSWindow from './OSWindow';

export default function DesktopContent() {
  const windows = useWindowsStore((s) => s.windows);

  return (
    <div className="relative flex h-screen w-screen select-none flex-col overflow-hidden bg-primary">
      <div className="relative flex flex-col gap-6 p-4">
        {icons.map((icon) => (
          <Icon key={icon.id} {...icon} />
        ))}
      </div>
      {windows.map((window) => (
        <OSWindow
          hideStatusBar={window.id === AppsNames.PORTFOLIO}
          key={window.id}
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
