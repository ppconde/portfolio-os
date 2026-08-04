import { createContext } from 'react-router';
import type { createGithubClient } from './graphql';

export type AppContext = {
  cloudflare: {
    env: Env;
    ctx: ExecutionContext;
  };
  clients: {
    // Lazy so the GITHUB_KEY secret is only resolved when a route needs it
    // (avoids failing prerender for routes that never call GitHub).
    getGithub: () => Promise<ReturnType<typeof createGithubClient>>;
  };
};

export const appContext = createContext<AppContext>();
