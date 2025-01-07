import { useState, createRef } from 'react';
import { useClickOutside } from '~/hooks/use-click-outside';

export default function Start() {
  const [isOpen, setIsOpen] = useState(false);
  const ref = createRef<HTMLDivElement>();
  useClickOutside(ref, () => setIsOpen(false));

  return (
    <>
      <button
        className={`${isOpen ? 'border-windows-inverted' : 'btn-windows'} relative flex h-full items-center p-1`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {!isOpen && (
          <div className="pointer-events-none absolute inset-0 border-b border-r border-windows-gray-secondary"></div>
        )}
        <img
          className="image-rendering-pixelated h-6 pr-1"
          src="/assets/windows-0.png"
          alt="Windows logo"
        />
        <p className="font-micro text-2xl">Start</p>
      </button>
      {isOpen && (
        <div
          ref={ref}
          className="border-windows absolute bottom-8 left-0 flex min-h-72 flex-row bg-windows-gray-primary"
        >
          <div className="from-windows-super-blue relative flex bg-gradient-to-tr to-windows-blue text-white">
            <p className="writing-v-lr rotate-180 p-1 text-left font-mono">
              <span className="font-bold">Ppconde</span>OS
            </p>
          </div>
          <div className="flex flex-col justify-end">
            {/** Separator */}
            <div className="border-b border-windows-gray-secondary" />
            <div className="border-t border-windows-white" />
            {/** Start buttons */}
            <button className="flex items-center p-1 pr-4 hover:bg-windows-blue hover:text-white">
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
      )}
    </>
  );
}
