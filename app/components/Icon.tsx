import { useContext, useState } from 'react';
import { WindowsContext } from '~/contexts/WindowsContext';
import { doubleTouch } from '~/handlers/double-touch.handler';
import { isTouchDevice } from '~/utils/media-matcher';

type IconProps = {
  name: string;
  icon: string;
};

export default function Icon({ name, icon }: IconProps) {
  const { addWindow } = useContext(WindowsContext);
  const [lastTap, setLastTap] = useState(0);

  const onDoubleClick = () => {
    // Double touch doesn't work on mobile, so it needs to be handled differently
    if (isTouchDevice()) {
      setLastTap(doubleTouch(lastTap, () => addWindow(name)));
    } else {
      addWindow(name);
    }
  };
  return (
    <div
      className="flex w-16 cursor-pointer flex-col items-center"
      onDoubleClick={onDoubleClick}
      onTouchStart={onDoubleClick}
    >
      <img src={icon} alt={name} className="mb-1 h-12 w-12" />
      <span className="text-center text-xs text-windows-white">{name}</span>
    </div>
  );
}
