import { createContext } from 'react-router';

export type AppContext = {
  cloudflare: {
    env: Env;
    ctx: ExecutionContext;
  };
  // Lazy so the GITHUB_KEY secret is only resolved when a route needs it
  // (avoids failing prerender for routes that never call GitHub).
  getGithubKey: () => Promise<string>;
};

export const appContext = createContext<AppContext>();
