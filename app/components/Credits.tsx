const inspirations = [
  {
    name: 'Henry Heffernan',
    href: 'https://henryheffernan.com/',
    note: 'for the portfolio OS that inspired this one',
  },
  {
    name: 'Bruno Simon',
    href: 'https://bruno-simon.com/',
    note: 'for the Three.js Journey course',
  },
  {
    name: 'Mr.doob',
    href: 'https://mrdoob.com/',
    note: 'for being such an inspirational human being',
  },
];

const role =
  'font-perfect-dos-vga text-xs uppercase tracking-[0.3em] text-quaternary';

// Movie end credits: a black screen rolling upward, paused while a link has keyboard focus.
export default function Credits() {
  return (
    <div className="text-tertiary h-full bg-black">
      <div className="credits h-full">
        <div className="credits-roll flex flex-col items-center gap-16 px-4 py-12 text-center">
          <header className="flex flex-col items-center gap-3">
            <p className={role}>A Pedro Conde production</p>
            <h2 className="font-micro text-7xl leading-none">Portfolio OS</h2>
          </header>

          <section className="flex flex-col items-center gap-2">
            <h3 className={role}>Created by</h3>
            <p className="font-ps-sans-nouveaux text-xl">Pedro Conde</p>
          </section>

          <section className="flex flex-col items-center gap-6">
            <h3 className={role}>Inspiration and thanks</h3>
            <ul className="flex flex-col gap-6">
              {inspirations.map(({ name, href, note }) => (
                <li className="flex flex-col gap-1" key={name}>
                  <a
                    aria-label={`Visit ${name}'s website`}
                    className="font-ps-sans-nouveaux text-xl hover:underline"
                    href={href}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {name}
                  </a>
                  <span className="text-secondary font-mono text-sm">
                    {note}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          <p className="font-micro text-5xl">Fin</p>
        </div>
      </div>
    </div>
  );
}
