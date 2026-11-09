import type { Icon as IconType } from '~/constants/icons.const';
import { useOpenApp } from '~/hooks/use-open-app';

export default function Icon(icon: IconType) {
  const openApp = useOpenApp();
  const open = () => openApp(icon);

  return (
    <button
      className="group w-fit"
      // A mouse needs a double-click, like a real desktop. Keyboard (Enter/Space
      // fire a click with detail 0) and touch open with a single press.
      onClick={(e) => {
        if (e.detail === 0 || matchMedia('(pointer: coarse)').matches) open();
      }}
      onDoubleClick={open}
      type="button"
    >
      <div className="flex w-16 cursor-pointer flex-col items-center">
        <img
          alt={icon.app}
          className="image-rendering-pixelated mb-1 h-12 w-12"
          src={icon.icon}
        />
        <span className="text-tertiary group-focus:bg-accent px-0.5 text-center text-xs">
          {icon.app}
        </span>
      </div>
    </button>
  );
}
