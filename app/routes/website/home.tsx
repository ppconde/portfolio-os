import NavList from '~/components/NavList';

export default function WebsiteHome() {
  return (
    <div className="bg-[length:10px_10px bg-[radial-gradient(#444cf7 0.5px, #e5e5f7 0.5px)] flex h-full flex-col items-center justify-center bg-white bg-opacity-[0.8] bg-repeat">
      <header className="p-4 text-center text-gray-800">
        <h1 className="border-b-4 border-l-2 border-r-4 border-t-2 border-gray-800 px-8 py-4 font-perfect-dos-vga-win text-7xl">
          Pedro Conde
        </h1>
        <p className="mt-4 font-mono text-xl">Software Engineer</p>
      </header>
      <nav className="flex text-xl">
        <NavList />
      </nav>
    </div>
  );
}
