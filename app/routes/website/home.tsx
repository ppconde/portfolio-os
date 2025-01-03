import NavList from '~/components/NavList';

export default function WebsiteHome() {
  return (
    <div className="bg-dot-pattern flex h-full flex-col items-center justify-center bg-[length:20px_20px] bg-[0_0_10px_10px] opacity-80">
      <header className="p-4 text-center text-gray-800">
        <h1 className="h-28 border-b-4 border-l-2 border-r-4 border-t-2 border-gray-800 bg-white px-8 py-4 text-center font-perfect-dos-vga-win text-7xl transition-all delay-75 duration-300 ease-in-out hover:border-b-8 hover:border-r-8">
          Pedro Conde
        </h1>

        <p className="mt-4 bg-white font-mono text-xl">Software Engineer</p>
      </header>
      <nav className="flex text-xl">
        <NavList />
      </nav>
    </div>
  );
}
