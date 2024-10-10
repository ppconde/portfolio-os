import Icon from "./Icon";

export default function Desktop() {
  return (
    <div className="bg-windows-teal h-screen overflow-hidden relative">
      <div className="grid grid-rows-[repeat(10,auto)] grid-flow-col auto-cols-max gap-2 p-2 justify-start">
        <Icon name="Recycle Bin" icon="/recycle_bin_full-2.png" />
        <Icon name="My Computer" icon="/public/computer-5.png" />
        <Icon name="About Me" icon="/msagent-4.png" />
        {/* Add more DesktopIcon components here to fill the grid */}
      </div>
    </div>
  )
}