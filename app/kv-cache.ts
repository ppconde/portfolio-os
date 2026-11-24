// Two KV copies of a list: a short-lived one that saves the fetch, and a
// "last good" one with no expiry, served when the source fails.
export async function cachedList<T>(
  kv: KVNamespace,
  key: string,
  ttl: number,
  waitUntil: (p: Promise<unknown>) => void,
  load: () => Promise<T[]>
): Promise<T[]> {
  const hit = await kv.get<T[]>(key, 'json');
  if (hit) return hit;
  try {
    const fresh = await load();
    if (fresh.length > 0) {
      const json = JSON.stringify(fresh);
      // Off the response path: the visitor doesn't wait on the cache writes.
      waitUntil(
        Promise.all([
          kv.put(key, json, { expirationTtl: ttl }),
          kv.put(`${key}:last_good`, json),
        ])
      );
    }
    return fresh;
  } catch (err) {
    if (err instanceof Response) throw err; // a deliberate status, e.g. 404
    const stale = await kv.get<T[]>(`${key}:last_good`, 'json');
    if (!stale) throw err;
    console.error('Serving the last good copy:', err);
    return stale;
  }
}
