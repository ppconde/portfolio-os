type ButtonProps = {
  onClick?: () => void;
  imageName?: string;
  imageAlt?: string;
};

export default function WindowButton({
  onClick,
  imageName,
  imageAlt = '',
}: ButtonProps) {
  return (
    <button
      className={`border-windows flex items-center bg-windows-gray-primary p-1`}
      onClick={onClick}
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
          className="image-rendering-pixelated object-center"
        />
      )}
    </button>
  );
}
