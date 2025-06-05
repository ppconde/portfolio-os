import { Graffle } from 'graffle';

export const graffle = Graffle.create().transport({
  url: 'https://api.github.com/graphql',
  headers: {
    authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    'User-Agent': 'portfolio-os (https://os.ppconde.com/)',
  },
});
