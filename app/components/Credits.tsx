import A from './website/A';
import H2 from './website/H2';

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

export default function Credits() {
  return (
    <div className="bg-tertiary flex h-full flex-col items-center justify-center p-4 font-mono">
      <H2>Credits</H2>
      <p className="my-2">This project was created by:</p>
      <ul className="mb-4 list-inside list-disc">
        <li>Pedro Conde</li>
      </ul>
      <p className="my-2">Inspiration and thanks:</p>
      <ul className="mb-4 list-inside list-disc">
        {inspirations.map(({ name, href, note }) => (
          <li key={name}>
            <A ariaLabel={`Visit ${name}'s website`} href={href} title={name}>
              {name}
            </A>{' '}
            {note}
          </li>
        ))}
      </ul>
    </div>
  );
}
