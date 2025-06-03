type PinnedRepo = {
  __typename?: 'Repository';
  id: string;
  name: string;
  description?: string | null;
  url: string;
  homepageUrl?: string | null;
  openGraphImageUrl: string;
  languages?: {
    __typename?: 'LanguageConnection';
    nodes?: Array<{
      __typename?: 'Language';
      id: string;
      name: string;
      color?: string | null;
    } | null> | null;
  } | null;
};

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

export default function normalizePinnedRepos(repo: PinnedRepo): Project {
  return {
    id: repo.id,
    name: repo.name,
    description: repo.description,
    url: repo.url,
    homepageUrl: repo.homepageUrl,
    openGraphImageUrl: repo.openGraphImageUrl,
    languages: (repo.languages?.nodes || [])
      ?.filter((language) => !!language)
      .map((language) => ({
        id: language.id,
        name: language.name,
        color: language.color || '#000000', // Default black color if not provided
      })),
  };
}
