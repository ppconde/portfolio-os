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
      className={`flex items-center border-2 border-b-black border-l-windows-white border-r-black border-t-windows-white bg-windows-gray-primary p-1`}
      onClick={onClick}
      // Needed for mobile touch events
      onTouchStart={onClick}
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
