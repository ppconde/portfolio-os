import { GET_REPOS_QUERY } from '~/queries/getPinnedRepos';

import ProjectCard from '~/components/website/ProjectCard';
import type { Route } from './+types/projects';
import H2 from '~/components/website/H2';
import { data } from 'react-router';
import { CACHE } from '~/constants/cache.const';
import normalizePinnedRepos, {
  type Project,
} from '~/normalizers/pinned-repos.normalizer';
import type { GetPinnedItemsQuery } from '~/__generated__/graphql';

export async function loader({ context }: Route.LoaderArgs) {
  const kv = context.cloudflare.env.PORTFOLIO_OS;

  // Try getting cached data
  // const cached = await kv.get(CACHE.PINNED_REPOS.KEY);

  // if (cached) {
  //   try {
  //     return JSON.parse(cached) as Project[];
  //   } catch (error) {
  //     console.error('Error parsing cached pinned repos:', error);
  //     // If parsing fails, we will fetch fresh data
  //   }
  // }

  const response = (await GET_REPOS_QUERY.send()) as GetPinnedItemsQuery;

  if ((response?.user?.pinnedItems.nodes || []).length <= 0) {
    console.error('Projects not found lol: ', response);
    throw data('Projects not found', {
      status: 404,
      statusText: `Projects not found ${response}!`,
    });
  }

  const repos = (response.user?.pinnedItems.nodes ?? [])
    .filter(
      (repo): repo is Extract<typeof repo, { __typename?: 'Repository' }> =>
        !!repo && repo.__typename === 'Repository'
    )
    .map(normalizePinnedRepos);

  // if (repos.length > 0) {
  //   // Cache it in KV
  //   await kv.put(CACHE.PINNED_REPOS.KEY, JSON.stringify(repos), {
  //     expirationTtl: CACHE.PINNED_REPOS.TTL,
  //   });
  // }

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
