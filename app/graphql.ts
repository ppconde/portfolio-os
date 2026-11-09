export async function githubQuery<TResult>(
  token: string,
  query: string
): Promise<TResult> {
  const res = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'User-Agent': 'portfolio-os (https://os.ppconde.com/)',
    },
    body: JSON.stringify({ query }),
  });
  const json = (await res.json()) as { data?: TResult; errors?: unknown };
  if (!res.ok || json.errors || !json.data) {
    throw new Error(`GitHub GraphQL request failed (${res.status})`, {
      cause: json,
    });
  }
  return json.data;
}
