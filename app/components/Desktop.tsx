import Icon from '~/components/Icon';
import Navbar from '~/components/Navbar';

export default function Desktop({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex h-screen w-screen flex-col overflow-hidden bg-windows-teal">
      <div className="relative flex flex-col gap-4 p-4">
        <Icon
          name="Portfolio Hub"
          icon="/assets/accesibility_window_abc.png"
          to="/website"
        />
      </div>
      {children}
      <Navbar />
    </div>
  );
}
