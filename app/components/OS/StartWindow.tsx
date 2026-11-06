import { createRef } from 'react';
import { icons } from '~/constants/icons.const';
import { useClickOutside } from '~/hooks/use-click-outside';
import { useOpenApp } from '~/hooks/use-open-app';
import { useBootStore } from '~/store/BootStore';

type StartWindowProps = {
  setIsOpen: (value: boolean) => void;
};

export default function StartWindow({ setIsOpen }: StartWindowProps) {
  const ref = createRef<HTMLDivElement>();
  useClickOutside(ref, () => setIsOpen(false));
  const setBootState = useBootStore((s) => s.setBootState);
  const openApp = useOpenApp();
  const item =
    'hover:bg-accent focus-visible:bg-accent flex w-full items-center gap-2 py-1 pr-6 pl-1 hover:text-white focus-visible:text-white focus-visible:outline-none';

  return (
    <div
      className="animate-start-open border-windows bg-secondary absolute bottom-8 left-0 z-9999 flex min-h-72 flex-row"
      data-testid="start-menu"
      ref={ref}
    >
      <div className="from-accent-light to-accent relative flex bg-linear-to-tr text-white">
        <p className="writing-v-lr rotate-180 p-1 text-left font-mono">
          <span className="font-bold">Ppconde</span>OS
        </p>
      </div>
      <div className="flex flex-col justify-end font-mono text-sm tracking-tight">
        {icons.map((icon) => (
          <button
            className={item}
            key={icon.label}
            onClick={() => {
              openApp(icon);
              setIsOpen(false);
            }}
            type="button"
          >
            <img alt="" className="h-8 w-8" src={icon.icon} />
            <span>{icon.label}</span>
          </button>
        ))}
        <hr className="border-t-quaternary border-b-tertiary mx-1 my-1 border-t border-b" />
        <button
          className={item}
          onClick={() => setBootState('shutting_down')}
          type="button"
        >
          <img alt="" className="h-8 w-8" src="/assets/shut_down_cool-5.png" />
          <span>
            Sh<span className="underline">u</span>t Down...
          </span>
        </button>
      </div>
    </div>
  );
}
