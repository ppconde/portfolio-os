import { useContext } from 'react';
import { Link } from 'react-router';
import type { AppsNames } from '~/constants/apps-names.const';
import { AppsContext } from '~/contexts/AppsContext';
import { useDoubleClick } from '~/hooks/use-double-click';

type IconProps = {
  id: AppsNames;
  name: AppsNames;
  icon: string;
  to: string;
};

export default function Icon({ id, name, icon, to }: IconProps) {
  const { addWindow } = useContext(AppsContext);
  const onDoubleTap = () => addWindow(id, name);

  const onClick = useDoubleClick(onDoubleTap);

  return (
    <Link to={to} onClick={onClick} prefetch="intent" className="w-fit">
      <div className="flex w-16 cursor-pointer flex-col items-center">
        <img src={icon} alt={name} className="mb-1 h-12 w-12" />
        <span className="text-windows-white text-center text-xs">{name}</span>
      </div>
    </Link>
  );
}
