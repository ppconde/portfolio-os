type ButtonProps = {
  onClick?: () => void;
  imageName?: string;
  imageAlt?: string;
  'test-id'?: string;
};

export default function WindowButton({
  onClick,
  imageName,
  imageAlt = '',
  'test-id': testId,
}: ButtonProps) {
  return (
    <button
      className="border-windows bg-secondary flex items-center p-1"
      onClick={onClick}
      data-testid={testId}
      // Needed for mobile touch events
      onTouchEnd={(e) => {
        // Prevents the default behavior to mess up with react draggable
        e.preventDefault();
        onClick?.();
      }}
    >
      {imageName && (
        <img
          src={imageName}
          alt={imageAlt}
          className="image-rendering-pixelated h-2.5 w-auto object-center"
        />
      )}
    </button>
  );
}
