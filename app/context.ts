import { createContext } from 'react-router';
import type { createGithubClient } from './graphql';

export type AppContext = {
    cloudflare: {
        env: Env;
        ctx: ExecutionContext;
    };
    clients: {
        github: ReturnType<typeof createGithubClient>;
    };
};

export const appContext = createContext<AppContext>();
