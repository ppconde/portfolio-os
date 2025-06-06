import { Graffle } from 'graffle';

export const createGithubClient = (token: string) => {
  return Graffle.create().transport({
    url: 'https://api.github.com/graphql',
    headers: {
      authorization: `Bearer ${token}`,
      'User-Agent': 'portfolio-os (https://os.ppconde.com/)',
    },
  });
};
