import { GET_REPOS_QUERY } from '~/queries/getPinnedRepos';

import ProjectCard from '~/components/website/ProjectCard';
import type { Route } from './+types/projects';
import H2 from '~/components/website/H2';
import normalizePinnedRepos from '~/normalizers/pinned-repos.normalizer';
import type { GetPinnedItemsQuery } from '~/__generated__/graphql';

export async function loader() {
  const response = (await GET_REPOS_QUERY.send()) as GetPinnedItemsQuery;
  console.log('Response from GET_REPOS_QUERY:', response);
  const repos = (response?.user?.pinnedItems.nodes ?? [])
    .filter(
      (repo): repo is Extract<typeof repo, { __typename?: 'Repository' }> =>
        !!repo && repo.__typename === 'Repository'
    )
    .map(normalizePinnedRepos);
  console.log('Normalized Repositories:', repos);
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
