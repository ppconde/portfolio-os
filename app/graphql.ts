import type { TypedDocumentString } from './__generated__/graphql';

export async function githubQuery<TResult, TVariables>(
  token: string,
  query: TypedDocumentString<TResult, TVariables>
): Promise<TResult> {
  const res = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'User-Agent': 'portfolio-os (https://os.ppconde.com/)',
    },
    body: JSON.stringify({ query: query.toString() }),
  });
  const json = (await res.json()) as { data?: TResult; errors?: unknown };
  if (!res.ok || json.errors || !json.data) {
    throw new Error(`GitHub GraphQL request failed (${res.status})`, {
      cause: json,
    });
  }
  return json.data;
}
