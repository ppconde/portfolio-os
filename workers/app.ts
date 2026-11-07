import { createRequestHandler, RouterContextProvider } from 'react-router';
import { appContext } from '../app/context';

export { Room } from './room';

const requestHandler = createRequestHandler(
  () => import('virtual:react-router/server-build'),
  import.meta.env.MODE
);

export default {
  async fetch(request, env, ctx) {
    // The Book Room's WebSocket goes to its one Durable Object.
    if (new URL(request.url).pathname === '/api/room') {
      if (request.headers.get('Upgrade') !== 'websocket')
        return new Response('Expected a WebSocket', { status: 426 });
      return env.ROOM.getByName('book-room').fetch(request);
    }

    // Dev: plain env var. Prod: Cloudflare Secrets Store.
    const getGithubKey = async () => {
      const key = env.GITHUB_KEY || (await env.PORTFOLIO_OS_SECRETS?.get());
      if (!key) {
        throw new Error(
          'GITHUB_KEY is not configured. Set it in .env.local or Cloudflare Secrets Store.'
        );
      }
      return key;
    };

    const context = new RouterContextProvider();
    context.set(appContext, { cloudflare: { env, ctx }, getGithubKey });

    return requestHandler(request, context);
  },
} satisfies ExportedHandler<Env>;
