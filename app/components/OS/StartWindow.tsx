import { createRef } from 'react';
import { useClickOutside } from '~/hooks/use-click-outside';
import { useBootStore } from '~/store/BootStore';

type StartWindowProps = {
  setIsOpen: (value: boolean) => void;
};

export default function StartWindow({ setIsOpen }: StartWindowProps) {
  const ref = createRef<HTMLDivElement>();
  useClickOutside(ref, () => setIsOpen(false));
  const setBootState = useBootStore((s) => s.setBootState);

  return (
    <div
      className="border-windows bg-secondary absolute bottom-8 left-0 z-9999 flex min-h-72 flex-row"
      ref={ref}
    >
      <div className="from-accent-light to-accent relative flex bg-linear-to-tr text-white">
        <p className="writing-v-lr rotate-180 p-1 text-left font-mono">
          <span className="font-bold">Ppconde</span>OS
        </p>
      </div>
      <div className="flex flex-col justify-end font-mono text-sm tracking-tight">
        <button
          className="hover:bg-accent focus-visible:bg-accent flex w-full items-center gap-2 py-1 pr-6 pl-1 hover:text-white focus-visible:text-white focus-visible:outline-none"
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
