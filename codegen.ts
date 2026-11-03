import { existsSync } from 'node:fs';
import type { CodegenConfig } from '@graphql-codegen/cli';

if (existsSync('.env.local')) process.loadEnvFile('.env.local');

const config: CodegenConfig = {
  schema: {
    'https://api.github.com/graphql': {
      headers: {
        authorization: `Bearer ${process.env.GITHUB_KEY}`,
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
        fragmentMasking: false,
      },
      config: {
        useTypeImports: true,
        documentMode: 'string',
      },
    },
  },
  ignoreNoDocuments: true,
};

export default config;
