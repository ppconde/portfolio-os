import H2 from './website/H2';

export default function Credits() {
  return (
    <div className="bg-windows-white flex h-full flex-col items-center justify-center p-4 font-mono">
      <H2>Credits</H2>
      <p className="my-2">This project was created by:</p>
      <ul className="mb-4 list-inside list-disc">
        <li>Pedro Conde</li>
      </ul>
    </div>
  );
}
