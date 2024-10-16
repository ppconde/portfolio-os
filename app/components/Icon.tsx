type IconProps = {
  name: string
  icon: string
}

export default function Icon({ name, icon }: IconProps) {
  return (
    <div className="flex cursor-pointer flex-col items-center p-2">
      <img src={icon} alt={name} className="mb-1 h-12 w-12" />
      <span className="text-center text-xs text-white">{name}</span>
    </div>
  )
}
