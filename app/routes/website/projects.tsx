import { GET_REPOS_QUERY } from '~/queries/getPinnedRepos';

import ProjectCard from '~/components/website/ProjectCard';
import type { Route } from './+types/projects';
import H2 from '~/components/website/H2';
import normalizePinnedRepos from '~/normalizers/pinned-repos.normalizer';

import type { AppLoadContext } from 'react-router';
import { parse } from 'graphql';

import type { GetPinnedItemsQuery } from '~/__generated__/graphql';
import { CACHE } from '~/constants/cache.const';

export async function loader(request: Route.LoaderArgs) {
  try {
    const context = request.context as AppLoadContext;
    const { PORTFOLIO_OS_KV } = context.cloudflare.env;

    console.log('Fetching pinned repositories...', PORTFOLIO_OS_KV);
    const cachedData = await PORTFOLIO_OS_KV.get(CACHE.PINNED_REPOS.KEY);
    if (cachedData) {
      return JSON.parse(cachedData);
    }

    const { github } = context.clients;
    const response = (await github
      .gql(parse(GET_REPOS_QUERY))
      .send()) as GetPinnedItemsQuery;

    if (!response?.user?.pinnedItems?.nodes) {
      throw new Response('No repositories found', { status: 404 });
    }

    const repos = response.user.pinnedItems.nodes
      .filter(
        (repo): repo is Extract<typeof repo, { __typename?: 'Repository' }> =>
          !!repo && repo.__typename === 'Repository'
      )
      .map(normalizePinnedRepos);

    if (repos.length > 0) {
      await PORTFOLIO_OS_KV.put(CACHE.PINNED_REPOS.KEY, JSON.stringify(repos), {
        expirationTtl: CACHE.PINNED_REPOS.TTL,
      });
    }
    return repos;
  } catch (err) {
    const error = err as Error;
    console.error('Failed to load repos:', error.message);
    throw new Response('Failed to fetch repositories', { status: 500 });
  }
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
