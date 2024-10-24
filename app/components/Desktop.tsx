import Icon from '~/components/Icon';
import Navbar from '~/components/Navbar';

export default function Desktop({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col bg-windows-teal">
      <div className="justify-star relative flex flex-col items-start gap-4 p-4">
        <Icon name="Recycle Bin" icon="/recycle_bin_full-2.png" />
        <Icon name="My Computer" icon="/computer-5.png" />
        <Icon name="About Me" icon="/msagent-4.png" />
        {/* Add more DesktopIcon components here to fill the grid */}
      </div>
      {children}
      <Navbar />
    </div>
  );
}
