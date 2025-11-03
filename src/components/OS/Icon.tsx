import { useWindowsStore } from '~/store/WindowsStore';
import { useDoubleClick } from '~/hooks/use-double-click';
import { Link } from 'react-router';
import type { Icon } from '~/constants/icons.const';

export default function Icon({ id, name, icon, to }: Icon) {
  const { addWindow } = useWindowsStore();
  const onDoubleTap = () => addWindow(id, name);

  const onClick = useDoubleClick(onDoubleTap);
  const content = (
    <div className="flex w-16 cursor-pointer flex-col items-center">
      <img src={icon} alt={name} className="mb-1 h-12 w-12" />
      <span className="text-windows-white text-center text-xs">{name}</span>
    </div>
  );

  return to ? (
    <Link to={to} onClick={onClick} prefetch="intent" className="w-fit">
      {content}
    </Link>
  ) : (
    <button className="w-fit" onClick={onClick}>
      {content}
    </button>
  );
}
