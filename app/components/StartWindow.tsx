import { createRef } from 'react';
import { useBootContext } from '~/contexts/BootContext';
import { useClickOutside } from '~/hooks/use-click-outside';

type StartWindowProps = {
  setIsOpen: (value: boolean) => void;
};

export default function StartWindow({ setIsOpen }: StartWindowProps) {
  const ref = createRef<HTMLDivElement>();
  useClickOutside(ref, () => setIsOpen(false));
  const { setBootState } = useBootContext();

  return (
    <div
      ref={ref}
      className="border-windows absolute bottom-8 left-0 flex min-h-72 flex-row bg-windows-gray-primary"
    >
      <div className="relative flex bg-linear-to-tr from-windows-super-blue to-windows-blue text-white">
        <p className="writing-v-lr rotate-180 p-1 text-left font-mono">
          <span className="font-bold">Ppconde</span>OS
        </p>
      </div>
      <div className="flex flex-col justify-end">
        {/** Separator */}
        <div className="border-b border-windows-gray-secondary" />
        <div className="border-t border-windows-white" />
        {/** Start buttons */}
        <button
          className="flex items-center p-1 pr-4 hover:bg-windows-blue hover:text-white"
          onClick={() => setBootState('shutting_down')}
        >
          <img
            className="h-10 pr-1"
            src="/assets/shut_down_cool-5.png"
            alt="Windows logo"
          />
          <p className="font-mono text-sm tracking-tight">
            Sh<span className="underline">u</span>t Down...
          </p>
        </button>
      </div>
    </div>
  );
}
