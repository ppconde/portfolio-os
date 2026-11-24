import H2 from '~/components/website/H2';
import ProjectCard, { type Project } from '~/components/website/ProjectCard';
import { appContext } from '~/context';
import { cachedList } from '~/kv-cache';
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
    nodes: ({ id: string; name: string; color: string | null } | null)[] | null;
  } | null;
};

const CACHE_KEY = 'pinned_repos';
const CACHE_TTL = 60 * 10; // 10 minutes

export async function loader({ context }: Route.LoaderArgs) {
  const { cloudflare, getGithubKey } = context.get(appContext);
  try {
    return await cachedList(
      cloudflare.env.PORTFOLIO_OS_KV,
      CACHE_KEY,
      CACHE_TTL,
      (p) => cloudflare.ctx.waitUntil(p),
      async (): Promise<Project[]> => {
        const res = await fetch('https://api.github.com/graphql', {
          method: 'POST',
          headers: {
            authorization: `Bearer ${await getGithubKey()}`,
            'Content-Type': 'application/json',
            'User-Agent': 'portfolio-os (https://os.ppconde.com/)',
          },
          body: JSON.stringify({ query: QUERY }),
        });
        const json = (await res.json()) as {
          data?: { user: { pinnedItems: { nodes: (Repo | null)[] } } | null };
          errors?: unknown;
        };
        if (!res.ok || json.errors || !json.data)
          throw new Error(`GitHub GraphQL request failed (${res.status})`, {
            cause: json,
          });
        const nodes = json.data.user?.pinnedItems.nodes;
        if (!nodes) {
          throw new Response('No repositories found', { status: 404 });
        }

        return nodes
          .filter((repo) => !!repo)
          .map(({ languages, ...repo }) => ({
            ...repo,
            languages: (languages?.nodes ?? [])
              .filter((l) => !!l)
              .map((l) => ({
                ...l,
                color: l.color || '#000000',
              })),
          }));
      }
    );
  } catch (err) {
    if (err instanceof Response) throw err; // our own 404 above, keep its status
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
