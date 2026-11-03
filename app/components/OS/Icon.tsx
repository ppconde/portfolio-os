import { Link } from 'react-router';
import type { Icon as IconType } from '~/constants/icons.const';
import { useWindowsStore } from '~/store/WindowsStore';

export default function Icon({ id, icon, to }: IconType) {
  const addWindow = useWindowsStore((s) => s.addWindow);
  const onDoubleClick = () => addWindow(id);
  const content = (
    <div className="flex w-16 cursor-pointer flex-col items-center">
      <img alt={id} className="mb-1 h-12 w-12" src={icon} />
      <span className="text-tertiary text-center text-xs">{id}</span>
    </div>
  );

  return to ? (
    <Link
      className="w-fit"
      onDoubleClick={onDoubleClick}
      prefetch="intent"
      to={to}
    >
      {content}
    </Link>
  ) : (
    <button className="w-fit" onDoubleClick={onDoubleClick} type="button">
      {content}
    </button>
  );
}
