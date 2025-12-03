import { useState } from 'react';
import StartWindow from './StartWindow';
import classNames from 'classnames';

export default function Start() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="h-[80%] min-w-20 pr-1">
      <button
        className={classNames(
          'btn-windows relative flex h-full items-center p-1',
          { 'btn-windows-inverted': isOpen }
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        {!isOpen && (
          <div className="border-windows-gray-secondary pointer-events-none absolute inset-0 border-r border-b"></div>
        )}
        <img
          className="image-rendering-pixelated h-6 w-auto pr-1"
          src="/assets/windows-0.png"
          alt="Windows logo"
        />
        <p className="font-micro text-2xl">Start</p>
      </button>
      {isOpen && <StartWindow setIsOpen={setIsOpen} />}
    </div>
  );
}
