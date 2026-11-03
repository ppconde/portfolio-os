import { createRef } from 'react';
import { Link } from 'react-router';
import { icons } from '~/constants/icons.const';
import { useClickOutside } from '~/hooks/use-click-outside';
import { useBootStore } from '~/store/BootStore';
import { useWindowsStore } from '~/store/WindowsStore';

type StartWindowProps = {
  setIsOpen: (value: boolean) => void;
};

const itemClass =
  'hover:bg-accent focus-visible:bg-accent flex w-full items-center gap-2 py-1 pr-6 pl-1 hover:text-white focus-visible:text-white focus-visible:outline-none';

export default function StartWindow({ setIsOpen }: StartWindowProps) {
  const ref = createRef<HTMLDivElement>();
  useClickOutside(ref, () => setIsOpen(false));
  const setBootState = useBootStore((s) => s.setBootState);
  const addWindow = useWindowsStore((s) => s.addWindow);

  return (
    <div
      className="border-windows bg-secondary absolute bottom-8 left-0 z-9999 flex flex-row"
      ref={ref}
    >
      <div className="from-accent-light to-accent relative flex bg-linear-to-tr text-white">
        <p className="writing-v-lr rotate-180 p-1 text-left font-mono">
          <span className="font-bold">Ppconde</span>OS
        </p>
      </div>
      <div className="flex flex-col justify-end font-mono text-sm tracking-tight">
        {icons.map(({ id, icon, to }) => {
          const open = () => {
            addWindow(id);
            setIsOpen(false);
          };
          const content = (
            <>
              <img alt="" className="h-8 w-8" src={icon} />
              {id}
            </>
          );
          return to ? (
            <Link className={itemClass} key={id} onClick={open} to={to}>
              {content}
            </Link>
          ) : (
            <button className={itemClass} key={id} onClick={open} type="button">
              {content}
            </button>
          );
        })}
        {/** Separator */}
        <div className="border-quaternary mx-1 mt-1 border-b" />
        <div className="border-tertiary mx-1 mb-1 border-t" />
        <button
          className={itemClass}
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
