export default function HamburgerButton({
  isOpen,
  onClick,
  className,
}: {
  isOpen: boolean;
  onClick: () => void;
  className: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`h-12 w-12 focus:outline-none ${className}`}
      aria-label={isOpen ? 'Close menu' : 'Open menu'}
    >
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {/* Top line */}
        <div
          className={`h-0.5 w-6 transform-gpu bg-gray-900 transition-all duration-300 ease-in-out ${
            isOpen ? 'translate-y-1 rotate-45' : '-translate-y-1'
          }`}
        />
        {/* Bottom line */}
        <div
          className={`h-0.5 w-6 transform-gpu bg-gray-900 transition-all duration-300 ease-in-out ${
            isOpen ? '-translate-y-0 -rotate-45' : 'translate-y-1'
          }`}
        />
      </div>
    </button>
  );
}
