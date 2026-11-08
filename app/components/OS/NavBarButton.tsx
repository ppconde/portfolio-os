import classNames from 'classnames';
import { icons } from '~/constants/icons.const';
import { type DesktopWindow, useWindowsStore } from '~/store/WindowsStore';

export default function NavBarButton({ window }: { window: DesktopWindow }) {
  const { toggleWindow } = useWindowsStore();

  return (
    <button
      className={classNames(
        'relative mx-1 flex h-full w-28 min-w-0 items-center p-2 text-sm md:w-40',
        {
          'btn-windows': window.isMinimized || !window.isFocused,
          'btn-windows-inverted': !window.isMinimized && window.isFocused,
        }
      )}
      data-taskbar-button={window.id}
      key={window.id}
      onClick={() => toggleWindow(window.id)}
      type="button"
    >
      <div
        className={classNames(
          'border-quaternary pointer-events-none absolute inset-0',
          {
            'border-r border-b': window.isMinimized || !window.isFocused,
            'border-t border-l': !window.isMinimized && window.isFocused,
          }
        )}
      ></div>
      <img
        alt=""
        className="mr-1 h-4 w-4 shrink-0"
        src={icons.find((icon) => icon.app === window.id)?.icon}
      />
      <span className="overflow-hidden text-ellipsis whitespace-nowrap">
        {window.id}
      </span>
    </button>
  );
}
