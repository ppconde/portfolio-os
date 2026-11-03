type ButtonProps = {
  onClick?: () => void;
  imageName?: string;
  imageAlt?: string;
  'data-testid'?: string;
};

export default function WindowButton({
  onClick,
  imageName,
  imageAlt = '',
  'data-testid': testId,
}: ButtonProps) {
  return (
    <button
      className="border-windows bg-secondary flex items-center p-1"
      data-testid={testId}
      onClick={onClick}
      onTouchEnd={(e) => {
        // Prevents the default behavior to mess up with react draggable
        e.preventDefault();
        onClick?.();
      }}
      // Needed for mobile touch events
      type="button"
    >
      {imageName && (
        <img
          alt={imageAlt}
          className="image-rendering-pixelated h-2.5 w-auto object-center"
          src={imageName}
        />
      )}
    </button>
  );
}
