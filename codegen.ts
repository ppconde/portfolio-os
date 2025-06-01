import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: {
    'https://api.github.com/graphql': {
      headers: {
        authorization: `Bearer ${process.env.VITE_GITHUB_KEY}`,
        'User-Agent': 'portfolio-os',
      },
    },
  },
  documents: ['app/**/*.{ts,tsx}'],
  generates: {
    './app/__generated__/': {
      preset: 'client',
      plugins: [],
      presetConfig: {
        gqlTagName: 'gql',
      },
    },
  },
  ignoreNoDocuments: true,
};

export default config;
