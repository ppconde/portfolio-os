import type { GetPinnedItemsQuery } from '~/__generated__/graphql';
import { makeClient } from '~/graphql';
import { GET_REPOS } from '~/queries/getPinnedRepos';

import ProjectCard from '~/components/website/ProjectCard';
import type { Route } from './+types/projects';
import H2 from '~/components/website/H2';

export async function loader() {
  const client = makeClient();
  const { data } = await client.query<GetPinnedItemsQuery>({
    query: GET_REPOS,
  });

  /**@todo needs improvement  */
  return (data.user?.pinnedItems.nodes ?? []).map((repo) => {
    return {
      id: repo.id,
      name: repo.name,
      description: repo.description,
      url: repo.url,
      stargazerCount: repo.stargazerCount,
      homepageUrl: repo.homepageUrl,
      openGraphImageUrl: repo.openGraphImageUrl,
      languages: repo.languages.nodes.map((language) => ({
        id: language.id,
        name: language.name,
        color: language.color,
      })),
    };
  });
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
            stargazerCount={repo.stargazerCount}
            homepageUrl={repo.homepageUrl}
            openGraphImageUrl={repo.openGraphImageUrl}
            languages={repo.languages}
          />
        ))}
      </div>
    </div>
  );
}
