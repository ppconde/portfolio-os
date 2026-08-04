import { Link } from 'react-router';
import type { Icon as IconType } from '~/constants/icons.const';
import { useDoubleClick } from '~/hooks/use-double-click';
import { useWindowsStore } from '~/store/WindowsStore';

export default function Icon({ id, name, icon, to }: IconType) {
  const { addWindow } = useWindowsStore();
  const onDoubleTap = () => addWindow(id, name);

  const onClick = useDoubleClick(onDoubleTap);
  const content = (
    <div className="flex w-16 cursor-pointer flex-col items-center">
      <img alt={name} className="mb-1 h-12 w-12" src={icon} />
      <span className="text-center text-tertiary text-xs">{name}</span>
    </div>
  );

  return to ? (
    <Link className="w-fit" onClick={onClick} prefetch="intent" to={to}>
      {content}
    </Link>
  ) : (
    <button className="w-fit" onClick={onClick} type="button">
      {content}
    </button>
  );
}
