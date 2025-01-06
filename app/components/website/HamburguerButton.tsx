import { useState } from 'react';

export default function HamburgerButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <button
      onClick={() => setIsOpen(!isOpen)}
      className="relative h-12 w-12 focus:outline-none"
      aria-label={isOpen ? 'Close menu' : 'Open menu'}
    >
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {/* Top line */}
        <div
          className={`h-0.5 w-6 transform bg-black transition-all duration-300 ease-in-out ${
            isOpen ? 'translate-y-1 rotate-45' : '-translate-y-1'
          }`}
        />
        {/* Bottom line */}
        <div
          className={`h-0.5 w-6 transform bg-black transition-all duration-300 ease-in-out ${
            isOpen ? '-translate-y-0 -rotate-45' : 'translate-y-1'
          }`}
        />
      </div>
    </button>
  );
}
