import type { GetPinnedItemsQuery } from '~/__generated__/graphql';
import { makeClient } from '~/graphql';
import { GET_REPOS } from '~/queries/getPinnedRepos';

import ProjectCard from '~/components/website/ProjectCard';
import type { Route } from './+types/projects';
import H2 from '~/components/website/H2';
import { data, type LoaderFunctionArgs } from 'react-router';

const CACHE_KEY = 'pinned_repos';
const CACHE_TTL_SECONDS = 60 * 10; // 10 minutes

export async function loader({ context }: LoaderFunctionArgs) {
  const kv = context.cloudflare.env.PORTFOLIO_OS as KVNamespace;

  // Try getting cached data
  const cached = await kv.get(CACHE_KEY, {
    type: 'json',
  });

  if (cached) {
    return cached;
  }

  const client = makeClient();
  const {
    data: items,
    error,
    errors,
  } = await client.query<GetPinnedItemsQuery>({
    query: GET_REPOS,
  });

  if (
    (items.user?.pinnedItems.nodes || []).length <= 0 ||
    error ||
    errors?.length
  ) {
    throw data('Projects not found', {
      status: 404,
      statusText: 'Projects not found',
    });
  }

  const repos = (items.user?.pinnedItems.nodes ?? [])
    .filter(
      (repo): repo is Extract<typeof repo, { __typename?: 'Repository' }> =>
        !!repo && repo.__typename === 'Repository'
    )
    .map((repo) => {
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
            color: language.color,
          })),
      };
    });

  // Cache it in KV
  kv.put(CACHE_KEY, JSON.stringify(repos), {
    expirationTtl: CACHE_TTL_SECONDS,
  });

  return repos;
}

export default function Projects({ loaderData: repos }: Route.ComponentProps) {
  return (
    <div className="@container space-y-6">
      <H2>Projects</H2>
      <div className="grid grid-cols-1 gap-6 @md:grid-cols-2 @xl:grid-cols-3">
        {repos?.map((repo) => (
          <ProjectCard
            key={repo.id}
            name={repo.name}
            description={repo.description}
            url={repo.url}
            homepageUrl={repo.homepageUrl}
            openGraphImageUrl={repo.openGraphImageUrl}
            languages={repo.languages}
          />
        ))}
      </div>
    </div>
  );
}
