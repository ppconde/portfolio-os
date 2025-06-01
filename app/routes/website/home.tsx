import NavList from '~/components/NavList';

export default function WebsiteHome() {
  return (
    <section className="bg-dots @container flex h-full w-full flex-col items-center justify-center overflow-hidden bg-[0_0_10px_10px] bg-[length:20px_20px] bg-repeat">
      <header className="flex flex-col p-4 text-center text-gray-900">
        <div className="flex items-center justify-center">
          <h1 className="font-perfect-dos-vga-win card-shadow box-border min-h-3.5 rounded-xl border-2 border-l-2 border-gray-800 bg-white px-8 py-4 text-center text-7xl">
            Pedro Conde
          </h1>
        </div>

        <p className="mt-4 bg-white font-mono text-xl">Software Engineer</p>
      </header>
      <NavList className="flex w-full flex-col items-center justify-center text-xl @lg:flex-row" />
    </section>
  );
}
