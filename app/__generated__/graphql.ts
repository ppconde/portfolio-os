/* eslint-disable */
/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
import type { DocumentTypeDecoration } from '@graphql-typed-document-node/core';
export type GetPinnedItemsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetPinnedItemsQuery = { user: { pinnedItems: { nodes: Array<
        | { __typename: 'Repository', id: string, name: string, description: string | null, url: unknown, homepageUrl: unknown, openGraphImageUrl: unknown, languages: { nodes: Array<{ id: string, name: string, color: string | null } | null> | null } | null }
        | Record<PropertyKey, never>
       | null> | null } } | null };

export class TypedDocumentString<TResult, TVariables>
  extends String
  implements DocumentTypeDecoration<TResult, TVariables>
{
  __apiType?: NonNullable<DocumentTypeDecoration<TResult, TVariables>['__apiType']>;
  private value: string;
  public __meta__?: Record<string, any> | undefined;

  constructor(value: string, __meta__?: Record<string, any> | undefined) {
    super(value);
    this.value = value;
    this.__meta__ = __meta__;
  }

  override toString(): string & DocumentTypeDecoration<TResult, TVariables> {
    return this.value;
  }
}

export const GetPinnedItemsDocument = new TypedDocumentString(`
    query GetPinnedItems {
  user(login: "ppconde") {
    pinnedItems(first: 6, types: REPOSITORY) {
      nodes {
        ... on Repository {
          __typename
          id
          name
          description
          url
          homepageUrl
          openGraphImageUrl
          languages(first: 1, orderBy: { field: SIZE, direction: DESC }) {
            nodes {
              id
              name
              color
            }
          }
        }
      }
    }
  }
}
    `) as unknown as TypedDocumentString<GetPinnedItemsQuery, GetPinnedItemsQueryVariables>;