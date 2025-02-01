import { Outlet } from 'react-router';
import { useContext } from 'react';
import { AppsContext } from '~/contexts/AppsContext';
import Icon from './Icon';
import Navbar from './Navbar';
import { AppsNames } from '~/constants/apps-names.const';
import OSWindow from './OSWindow';
import { icons } from '~/constants/icons.const';

export default function DesktopContent() {
  const { windows } = useContext(AppsContext);

  return (
    <div className="bg-windows-teal relative flex h-screen w-screen flex-col overflow-hidden select-none">
      <div className="relative flex flex-col gap-6 p-4">
        {icons.map((icon) => (
          <Icon
            key={icon.id}
            id={icon.id}
            name={icon.name}
            icon={icon.path}
            to={icon.to}
          />
        ))}
      </div>
      {windows.map((window) => (
        <OSWindow
          key={window.id}
          window={window}
          hideStatusBar={window.id === AppsNames.PORTFOLIO}
        >
          {window.id === AppsNames.PORTFOLIO && <Outlet />}
        </OSWindow>
      ))}
      <Navbar />
    </div>
  );
}
