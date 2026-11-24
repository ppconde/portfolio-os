// Web Storage that never throws: in private mode or with storage blocked it
// just doesn't remember.
export const store = (
  kind: 'local' | 'session',
  key: string,
  value?: string
) => {
  try {
    const s = kind === 'local' ? localStorage : sessionStorage;
    if (value === undefined) return s.getItem(key);
    s.setItem(key, value);
  } catch {}
  return null;
};
