type IconProps = {
    name: string;
    icon: string;
}

export default function Icon({ name, icon }: IconProps) {
    return (
        <div className="flex flex-col items-center p-2 cursor-pointer">
            <img src={icon} alt={name} className="w-12 h-12 mb-1" />
            <span className="text-xs text-center text-white">{name}</span>
        </div>
    );
}
