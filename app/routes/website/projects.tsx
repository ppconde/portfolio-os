import H2 from '~/components/website/H2';

import ProjectCard from '~/components/website/ProjectCard';
import { CACHE } from '~/constants/cache.const';
import { appContext } from '~/context';
import normalizePinnedRepos from '~/normalizers/pinned-repos.normalizer';
import { GET_REPOS_QUERY } from '~/queries/getPinnedRepos';
import type { Route } from './+types/projects';

export async function loader({ context }: Route.LoaderArgs) {
  try {
    const { cloudflare, clients } = context.get(appContext);
    const { PORTFOLIO_OS_KV } = cloudflare.env;

    const cachedData = await PORTFOLIO_OS_KV.get(CACHE.PINNED_REPOS.KEY);
    if (cachedData) {
      return JSON.parse(cachedData);
    }

    const response = await (await clients.getGithub())
      .gql(GET_REPOS_QUERY)
      .$send();

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
    // Surface as much detail as possible: Graffle often throws errors with an
    // empty `message` when GitHub replies with a non-GraphQL body (e.g. 401
    // "Bad credentials" from an expired PAT), which leaves logs showing only a
    // stack trace with no cause.
    const error = err as Error & { cause?: unknown; errors?: unknown };
    console.error('Failed to load repos', {
      name: error?.name,
      message: error?.message,
      cause: error?.cause,
      errors: error?.errors,
      stack: error?.stack,
    });
    throw new Response('Failed to fetch repositories', { status: 500 });
  }
}

export default function Projects({ loaderData: repos }: Route.ComponentProps) {
  return (
    <div className="@container space-y-6">
      <H2>Projects</H2>
      <div className="grid @md:grid-cols-2 @xl:grid-cols-3 grid-cols-1 gap-6">
        {repos?.map((repo) => (
          <ProjectCard
            description={repo.description}
            homepageUrl={repo.homepageUrl}
            key={repo.id}
            languages={repo.languages}
            name={repo.name}
            openGraphImageUrl={repo.openGraphImageUrl}
            url={repo.url}
          />
        ))}
      </div>
    </div>
  );
}
