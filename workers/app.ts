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
    let GITHUB_KEY = '';

    // In development, try to get from environment variable first
    // In production, get from Cloudflare Secrets Storage
    if (env.GITHUB_KEY) {
      GITHUB_KEY = env.GITHUB_KEY;
    } else if (env.PORTFOLIO_OS_SECRETS) {
      GITHUB_KEY = await env.PORTFOLIO_OS_SECRETS.get();
    }

    if (!GITHUB_KEY) {
      console.error('GITHUB_KEY is not configured. Please set it in your .env.local file or Cloudflare Secrets Storage.');
      throw new Error('GITHUB_KEY secret is not configured');
    }

    return requestHandler(request, {
      cloudflare: { env, ctx },
      clients: {
        github: createGithubClient(GITHUB_KEY),
      },
    });
  },
} satisfies ExportedHandler<Env>;
