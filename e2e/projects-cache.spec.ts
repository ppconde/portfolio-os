import { expect, test } from '@playwright/test';
import { cachedList } from '../app/kv-cache';

// A Map standing in for KV: values are JSON strings, like the real thing.
const fakeKv = () => {
  const m = new Map<string, string>();
  const kv = {
    get: async (k: string) =>
      m.has(k) ? JSON.parse(m.get(k) as string) : null,
    put: async (k: string, v: string) => void m.set(k, v),
  };
  return { m, kv: kv as unknown as KVNamespace };
};

test('projects cache: GitHub down serves the last good copy', async () => {
  const { m, kv } = fakeKv();
  const writes: Promise<unknown>[] = [];
  const run = (load: () => Promise<string[]>) =>
    cachedList(kv, 'repos', 600, (p) => writes.push(p), load);

  // A good fetch keeps a short-lived copy and a last good one.
  expect(await run(async () => ['a', 'b'])).toEqual(['a', 'b']);
  await Promise.all(writes);
  expect(m.get('repos:last_good')).toBe('["a","b"]');

  // The short-lived copy expires, then GitHub fails: the last good copy is served.
  m.delete('repos');
  expect(
    await run(async () => {
      throw new Error('GitHub is down');
    })
  ).toEqual(['a', 'b']);

  // A deliberate status (the 404) still goes through.
  m.delete('repos');
  const notFound = new Response('No repositories found', { status: 404 });
  await expect(
    run(async () => {
      throw notFound;
    })
  ).rejects.toBe(notFound);

  // No last good copy yet: the failure surfaces.
  const empty = fakeKv();
  await expect(
    cachedList(
      empty.kv,
      'repos',
      600,
      () => {},
      async () => {
        throw new Error('GitHub is down');
      }
    )
  ).rejects.toThrow('GitHub is down');
});
