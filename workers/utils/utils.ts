import { env } from "cloudflare:workers"

export const getSecret = async (SECRET: string) => {
  const secretValue = (env as unknown as Record<string, unknown>)[SECRET];
  if (!secretValue) throw Error(`Missing secret (env.${SECRET})`)
  return typeof secretValue === 'string'
    ? secretValue
    : await (secretValue as { get: () => Promise<string> }).get()
}