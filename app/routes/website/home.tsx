import NavList from '~/components/OS/NavList';

export default function WebsiteHome() {
  return (
    <section className="bg-dots @container flex h-full w-full flex-col items-center justify-center overflow-hidden bg-[0_0_10px_10px] bg-[length:20px_20px] bg-repeat">
      <header className="flex flex-col p-4 text-center text-gray-900">
        <div className="flex items-center justify-center">
          {/* Win98 frame: raised grey bevel around a sunken white panel */}
          <div className="border-windows bg-secondary p-1">
            <h1 className="border-windows-sunken font-perfect-dos-vga-win border-2 bg-white px-4 py-4 text-center text-5xl @md:px-8 @md:text-7xl">
              Pedro Conde
            </h1>
          </div>
        </div>

        <p className="mt-2 bg-white p-1 font-mono text-xl">Software Engineer</p>
      </header>
      <NavList className="flex w-full flex-col items-center justify-center text-xl @lg:flex-row" />
    </section>
  );
}
