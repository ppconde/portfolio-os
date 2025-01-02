import { useContext } from 'react';
import { Outlet } from 'react-router';
import { WindowsContext } from '~/contexts/WindowsContext';
import OSWindow from '~/components/OSWindow';

export default function Windows() {
  const { windows } = useContext(WindowsContext);

  return (
    <>
      {windows.map((window) => (
        <OSWindow key={window.id} window={window}>
          {window.id === 'My Portfolio' && <Outlet context={window} />}
        </OSWindow>
      ))}
    </>
  );
}
