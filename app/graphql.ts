import type { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { Graffle } from 'graffle';

export type GithubClient = {
  gql<TResult, TVariables>(
    document: TypedDocumentNode<TResult, TVariables>
  ): {
    $send(): Promise<TResult>;
  };
};

export const createGithubClient = (token: string): GithubClient => {
  return Graffle.create().transport({
    url: 'https://api.github.com/graphql',
    headers: {
      authorization: `Bearer ${token}`,
      'User-Agent': 'portfolio-os (https://os.ppconde.com/)',
    },
  });
};
