import H2 from '~/components/website/H2';
import ProjectCard, { type Project } from '~/components/website/ProjectCard';
import { appContext } from '~/context';
import { githubQuery } from '~/graphql';
import type { Route } from './+types/projects';

const QUERY = `{
  user(login: "ppconde") {
    pinnedItems(first: 6, types: REPOSITORY) {
      nodes {
        ... on Repository {
          id
          name
          description
          url
          homepageUrl
          openGraphImageUrl
          languages(first: 1, orderBy: { field: SIZE, direction: DESC }) {
            nodes { id name color }
          }
        }
      }
    }
  }
}`;

type Repo = Omit<Project, 'languages'> & {
  languages: {
    nodes: { id: string; name: string; color: string | null }[] | null;
  } | null;
};

const CACHE_KEY = 'pinned_repos';
const CACHE_TTL = 60 * 10; // 10 minutes

export async function loader({ context }: Route.LoaderArgs) {
  try {
    const { cloudflare, getGithubKey } = context.get(appContext);
    const { PORTFOLIO_OS_KV } = cloudflare.env;

    const cached = await PORTFOLIO_OS_KV.get<Project[]>(CACHE_KEY, 'json');
    if (cached) return cached;

    const data = await githubQuery<{
      user: { pinnedItems: { nodes: (Repo | null)[] } } | null;
    }>(await getGithubKey(), QUERY);
    const nodes = data.user?.pinnedItems.nodes;
    if (!nodes) {
      throw new Response('No repositories found', { status: 404 });
    }

    const repos: Project[] = nodes
      .filter((repo) => !!repo)
      .map(({ languages, ...repo }) => ({
        ...repo,
        languages: (languages?.nodes ?? []).map((l) => ({
          ...l,
          color: l.color || '#000000',
        })),
      }));

    if (repos.length > 0) {
      // Off the response path: the visitor doesn't wait on the cache write.
      cloudflare.ctx.waitUntil(
        PORTFOLIO_OS_KV.put(CACHE_KEY, JSON.stringify(repos), {
          expirationTtl: CACHE_TTL,
        })
      );
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
