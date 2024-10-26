import { useContext } from 'react';
import OSWindow from '~/components/OSWindow';
import { WindowContext } from '~/contexts/WindowContext';

export default function Index() {
  const { windows } = useContext(WindowContext);

  return (
    <>
      {windows.map((window) => (
        <OSWindow key={window.id} window={window} />
      ))}
    </>
  );
}
