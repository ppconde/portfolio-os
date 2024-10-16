import Icon from '~/components/Icon'
import Navbar from '~/components/Navbar'

export default function Desktop({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen bg-windows-teal">
      <div className="grid auto-cols-max grid-flow-col grid-rows-[repeat(10,auto)] justify-start gap-2 p-2">
        <Icon name="Recycle Bin" icon="/recycle_bin_full-2.png" />
        <Icon name="My Computer" icon="/computer-5.png" />
        <Icon name="About Me" icon="/msagent-4.png" />
        {/* Add more DesktopIcon components here to fill the grid */}
      </div>
      {children}
      <Navbar />
    </div>
  )
}
