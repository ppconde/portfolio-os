import { useContext } from 'react';
import { Outlet } from 'react-router';
import { WindowsContext } from '~/contexts/WindowsContext';
import OSWindow from '~/components/OSWindow';
import { WindowsNames } from '~/constants/windows-names.const';

export default function WindowsLayout() {
  const { windows } = useContext(WindowsContext);

  return (
    <>
      {windows.map((window) => (
        <OSWindow key={window.id} window={window}>
          {window.id === WindowsNames.PORTFOLIO && <Outlet context={window} />}
        </OSWindow>
      ))}
    </>
  );
}
