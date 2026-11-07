// Augment Wrangler's generated Env without editing worker-configuration.d.ts.
interface Env {
  GITHUB_KEY?: string;
  ROOM: DurableObjectNamespace<import('./room').Room>;
}
