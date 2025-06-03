import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client/index.js';

export const graphqlClient = new ApolloClient({
  ssrMode: true,
  link: new HttpLink({
    uri: 'https://api.github.com/graphql',
    headers: {
      authorization: `Bearer ${import.meta.env.VITE_GITHUB_KEY}`,
      'User-Agent': 'portfolio-os (https://os.ppconde.com/)',
    },
  }),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          user: {
            merge: true,
          },
        },
      },
    },
  }),
});
