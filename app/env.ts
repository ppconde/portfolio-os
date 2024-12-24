import { type PlatformProxy } from "wrangler";

type Cloudflare = Omit<PlatformProxy<Env>, "dispose">;

declare module "react-router" {
    // Your AppLoadContext used in v2
    export interface AppLoadContext {
        cloudflare: Cloudflare;
        whatever: string;
    }
}

export { }; // necessary for TS to treat this as a module
