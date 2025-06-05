import { Graffle } from 'graffle';

export const graffle = Graffle.create().transport({
  url: 'https://api.github.com/graphql',
  headers: {
    authorization: `Bearer ${import.meta.env.VITE_GITHUB_KEY}`,
    'User-Agent': 'portfolio-os (https://os.ppconde.com/)',
  },
});
