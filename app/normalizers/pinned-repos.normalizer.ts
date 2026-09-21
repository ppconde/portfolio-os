import type { GetPinnedItemsQuery } from '~/__generated__/graphql';

export type PinnedRepo = Extract<
  NonNullable<
    NonNullable<
      NonNullable<GetPinnedItemsQuery['user']>['pinnedItems']
    >['nodes']
  >[number],
  { __typename: 'Repository' }
>;

export type Project = {
  id: string;
  name: string;
  description?: string | null;
  url: string;
  homepageUrl?: string | null;
  openGraphImageUrl: string;
  languages: LanguageNormalized[];
};

type LanguageNormalized = {
  id: string;
  name: string;
  color: string;
};

function requireString(value: unknown, field: string): string {
  if (typeof value !== 'string') {
    throw new TypeError(`Expected ${field} to be a string`);
  }

  return value;
}

function optionalString(value: unknown): string | null {
  return typeof value === 'string' ? value : null;
}

export default function normalizePinnedRepos(repo: PinnedRepo): Project {
  return {
    id: repo.id,
    name: repo.name,
    description: repo.description,
    url: requireString(repo.url, 'repo.url'),
    homepageUrl: optionalString(repo.homepageUrl),
    openGraphImageUrl: requireString(
      repo.openGraphImageUrl,
      'repo.openGraphImageUrl'
    ),
    languages: (repo.languages?.nodes || [])
      ?.filter((language) => !!language)
      .map((language) => ({
        id: language.id,
        name: language.name,
        color: language.color || '#000000',
      })),
  };
}
