import { useContext } from 'react';
import { Outlet } from '@remix-run/react';
import { WindowsContext } from '~/contexts/WindowsContext';
import OSWindow from '~/components/OSWindow';

export default function Windows() {
  const { windows } = useContext(WindowsContext);

  return (
    <>
      {windows.map((window) => (
        <OSWindow key={window.id} window={window}>
          {window.id === 'Portfolio Hub' && <Outlet context={window} />}
        </OSWindow>
      ))}
    </>
  );
}
