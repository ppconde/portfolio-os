import classNames from 'classnames';
import { type DesktopWindow, useWindowsStore } from '~/store/WindowsStore';

export default function NavBarButton({ window }: { window: DesktopWindow }) {
  const { toggleWindow } = useWindowsStore();

  return (
    <button
      className={classNames(
        'relative mx-1 flex h-full w-full min-w-[6rem] shrink basis-0 items-center p-2 text-sm',
        {
          'btn-windows': window.isMinimized || !window.isFocused,
          'btn-windows-inverted flex items-center p-2':
            !window.isMinimized && window.isFocused,
        }
      )}
      key={window.id}
      onClick={() => toggleWindow(window.id)}
      type="button"
    >
      <div
        className={classNames(
          'pointer-events-none absolute inset-0 border-quaternary',
          {
            'border-r border-b': window.isMinimized || !window.isFocused,
            'border-t border-l': !window.isMinimized && window.isFocused,
          }
        )}
      ></div>
      <div className="flex items-center">
        <img
          alt="Browser icon"
          className="mr-1 h-3 w-3"
          src="/assets/html-0.png"
        />
        <span className="overflow-hidden text-ellipsis whitespace-nowrap">
          {window.id}
        </span>
      </div>
    </button>
  );
}
