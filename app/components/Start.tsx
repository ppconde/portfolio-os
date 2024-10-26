export default function Start() {
  return (
    <button className="relative flex h-full items-center border-2 border-b-black border-l-windows-white border-r-black border-t-windows-white p-1">
      <div className="pointer-events-none absolute inset-0 border-b border-r border-windows-gray-secondary"></div>
      <img
        className="image-rendering-pixelated h-6 pr-1"
        src="/assets/windows-0.png"
        alt="Windows logo"
      />
      <p className="font-micro text-2xl">Start</p>
    </button>
  );
}
