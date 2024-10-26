import { useContext } from 'react';
import OSWindow from '~/components/OSWindow';
import { WindowsContext } from '~/contexts/WindowsContext';

export default function Index() {
  const { windows } = useContext(WindowsContext);

  return (
    <>
      {windows.map((window) => (
        <OSWindow key={window.id} window={window} />
      ))}
    </>
  );
}
