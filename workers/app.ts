import { createRequestHandler, RouterContextProvider } from 'react-router';
import { appContext } from '../app/context';
import { createGithubClient } from '../app/graphql';

const requestHandler = createRequestHandler(
  // eslint-disable-next-line import/no-unresolved
  () => import('virtual:react-router/server-build'),
  import.meta.env.MODE
);

export default {
  async fetch(request, env, ctx) {
    let cachedKey: string | undefined;
    const resolveGithubKey = async () => {
      if (cachedKey) return cachedKey;

      // In development, prefer the plain env var; in production, read the
      // secret from Cloudflare Secrets Storage. Resolved lazily so routes that
      // don't need GitHub (e.g. prerendered pages) don't require the secret.
      if (env.GITHUB_KEY) {
        cachedKey = env.GITHUB_KEY;
      } else if (env.PORTFOLIO_OS_SECRETS) {
        cachedKey = await env.PORTFOLIO_OS_SECRETS.get();
      }

      if (!cachedKey) {
        console.error(
          'GITHUB_KEY is not configured. Please set it in your .env.local file or Cloudflare Secrets Storage.'
        );
        throw new Error('GITHUB_KEY secret is not configured');
      }

      return cachedKey;
    };

    let cachedClient: ReturnType<typeof createGithubClient> | undefined;
    const getGithub = async () => {
      if (!cachedClient) {
        cachedClient = createGithubClient(await resolveGithubKey());
      }
      return cachedClient;
    };

    const context = new RouterContextProvider();
    context.set(appContext, {
      cloudflare: { env, ctx },
      clients: {
        getGithub,
      },
    });

    return requestHandler(request, context);
  },
} satisfies ExportedHandler<Env>;
