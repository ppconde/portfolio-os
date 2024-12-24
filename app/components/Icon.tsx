import { useContext } from 'react';
import { Link } from 'react-router';
import { WindowsContext } from '~/contexts/WindowsContext';

type IconProps = {
  name: string;
  icon: string;
  to: string;
};

export default function Icon({ name, icon, to }: IconProps) {
  const { addWindow } = useContext(WindowsContext);

  const onDoubleClick = () => {
    addWindow(name);
  };
  return (
    /** @TODO double click is not working using Link */
    (<Link
      to={to}
      onDoubleClick={onDoubleClick}
      prefetch="intent"
    >
      <div className="flex w-16 cursor-pointer flex-col items-center">
        <img src={icon} alt={name} className="mb-1 h-12 w-12" />
        <span className="text-center text-xs text-windows-white">{name}</span>
      </div>
    </Link>)
  );
}
