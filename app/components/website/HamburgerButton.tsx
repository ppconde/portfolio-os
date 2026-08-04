import classNames from 'classnames';

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
      aria-label={isOpen ? 'Close menu' : 'Open menu'}
      className={classNames('h-12 w-12 focus:outline-hidden', className)}
      onClick={onClick}
      type="button"
    >
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {/* Top line */}
        <div
          className={classNames(
            'h-0.5 w-6 transform-gpu bg-gray-900 transition-all duration-300 ease-in-out',
            isOpen ? 'translate-y-1 rotate-45' : '-translate-y-1'
          )}
        />
        {/* Bottom line */}
        <div
          className={classNames(
            'h-0.5 w-6 transform-gpu bg-gray-900 transition-all duration-300 ease-in-out',
            isOpen ? '-rotate-45 translate-y-0' : 'translate-y-1'
          )}
        />
      </div>
    </button>
  );
}
