import NavList from '~/components/NavList';

export default function WebsiteHome() {
  return (
    <section className="flex h-full w-full flex-col items-center justify-center overflow-hidden bg-dots bg-[length:20px_20px] bg-[0_0_10px_10px] bg-repeat @container">
      <header className="flex flex-col p-4 text-center text-gray-900">
        <div className="flex items-center justify-center">
          <h1 className="box-border min-h-3.5 rounded-xl border-b-4 border-l-2 border-r-4 border-t-2 border-gray-800 bg-white px-8 py-4 text-center font-perfect-dos-vga-win text-7xl transition-all delay-75 duration-300 ease-in-out hover:border-b-8 hover:border-r-8">
            Pedro Conde
          </h1>
        </div>

        <p className="mt-4 bg-white font-mono text-xl">Software Engineer</p>
      </header>
      <NavList className="flex w-full flex-col items-center justify-center text-xl @lg:flex-row" />
    </section>
  );
}
