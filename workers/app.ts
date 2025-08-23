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
    return requestHandler(request, {
      cloudflare: { env, ctx },
      clients: {
        github: createGithubClient(env.GITHUB_KEY),
      },
    });
  },
} satisfies ExportedHandler<Env>;
