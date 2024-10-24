type IconProps = {
  name: string;
  icon: string;
};

export default function Icon({ name, icon }: IconProps) {
  return (
    <div className="flex w-16 cursor-pointer flex-col items-center">
      <img src={icon} alt={name} className="mb-1 h-12 w-12" />
      <span className="text-center text-xs text-windows-white">{name}</span>
    </div>
  );
}
