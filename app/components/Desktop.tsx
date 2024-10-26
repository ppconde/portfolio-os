import Icon from '~/components/Icon';
import Navbar from '~/components/Navbar';

export default function Desktop({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex h-screen w-screen flex-col overflow-hidden bg-windows-teal">
      <div className="justify-star relative flex flex-col items-start gap-4 p-4">
        <Icon name="About Me" icon="/assets/accesibility_window_abc.png" />
      </div>
      {children}
      <Navbar />
    </div>
  );
}
