import { createRequestHandler } from 'react-router';
import { createGithubClient } from '../app/graphql';

declare module 'react-router' {
  export interface AppLoadContext {
    cloudflare: {
      env: Env;
      ctx: ExecutionContext;
    };
    clients: {
      github: ReturnType<typeof createGithubClient>;
    };
  }
}

const requestHandler = createRequestHandler(
  // eslint-disable-next-line import/no-unresolved
  () => import('virtual:react-router/server-build'),
  import.meta.env.MODE
);

export default {
  async fetch(request, env, ctx) {
    const token = env.VITE_GITHUB_KEY;
    const githubClient = createGithubClient(token);
    console.log('Creating GitHub client with token:', token);
    return requestHandler(request, {
      cloudflare: { env, ctx },
      clients: {
        github: githubClient,
      },
    });
  },
} satisfies ExportedHandler<Env>;
