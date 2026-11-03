import H2 from '~/components/website/H2';
import ProjectCard from '~/components/website/ProjectCard';
import { appContext } from '~/context';
import { githubQuery } from '~/graphql';
import normalizePinnedRepos, {
  type PinnedRepo,
  type Project,
} from '~/normalizers/pinned-repos.normalizer';
import { GET_REPOS_QUERY } from '~/queries/getPinnedRepos';
import type { Route } from './+types/projects';

const CACHE_KEY = 'pinned_repos';
const CACHE_TTL = 60 * 10; // 10 minutes

export async function loader({ context }: Route.LoaderArgs) {
  try {
    const { cloudflare, getGithubKey } = context.get(appContext);
    const { PORTFOLIO_OS_KV } = cloudflare.env;

    const cached = await PORTFOLIO_OS_KV.get<Project[]>(CACHE_KEY, 'json');
    if (cached) return cached;

    const data = await githubQuery(await getGithubKey(), GET_REPOS_QUERY);
    const nodes = data.user?.pinnedItems?.nodes;
    if (!nodes) {
      throw new Response('No repositories found', { status: 404 });
    }

    const repos = nodes
      .filter(
        (repo): repo is PinnedRepo => !!repo && repo.__typename === 'Repository'
      )
      .map(normalizePinnedRepos);

    if (repos.length > 0) {
      await PORTFOLIO_OS_KV.put(CACHE_KEY, JSON.stringify(repos), {
        expirationTtl: CACHE_TTL,
      });
    }
    return repos;
  } catch (err) {
    console.error('Failed to load repos', err);
    throw new Response('Failed to fetch repositories', { status: 500 });
  }
}

export default function Projects({ loaderData: repos }: Route.ComponentProps) {
  return (
    <div className="@container space-y-6">
      <H2>Projects</H2>
      <div className="grid grid-cols-1 gap-6 @md:grid-cols-2 @xl:grid-cols-3">
        {repos.map((repo) => (
          <ProjectCard key={repo.id} {...repo} />
        ))}
      </div>
    </div>
  );
}
