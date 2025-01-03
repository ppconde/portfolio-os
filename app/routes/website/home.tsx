import NavList from '~/components/NavList';

export default function WebsiteHome() {
  return (
    <div className="flex h-full flex-col items-center justify-center">
      <header className="p-4 text-center text-gray-800">
        <h1 className="font-perfect-dos-vga-win text-7xl">Pedro Conde</h1>
        <p className="font-mono text-xl">Software Engineer</p>
      </header>
      <nav className="flex text-xl">
        <NavList />
      </nav>
    </div>
  );
}
