import type { Project } from '~/normalizers/pinned-repos.normalizer';
import A from './A';

export default function ProjectCard({
  name,
  description,
  url,
  homepageUrl,
  openGraphImageUrl,
  languages,
}: Project) {
  return (
    <article className="card-shadow flex w-full max-w-md flex-col justify-between gap-2 border border-gray-800 bg-white p-2 text-sm">
      {homepageUrl && (
        <A
          ariaLabel={`View ${name} site`}
          href={homepageUrl}
          title={`View ${name} site`}
        >
          <img
            alt={`${name} preview`}
            className="h-auto w-full rounded object-contain"
            height={600}
            loading="lazy"
            src={
              // GitHub's auto-generated card (no custom social preview) fails to load,
              // so use our own app screenshot instead.
              // ponytail: needs public/assets/projects/<name>.png for each such repo.
              openGraphImageUrl.startsWith(
                'https://opengraph.githubassets.com/'
              )
                ? `/assets/projects/${name}.png`
                : openGraphImageUrl
            }
            width={1200}
          />
        </A>
      )}

      <h3>
        <A
          ariaLabel={`View ${name} on GitHub`}
          href={url}
          title={`View ${name} on GitHub`}
        >
          <strong>{name}</strong>
        </A>
      </h3>

      {description && (
        <p className="grow font-mono text-xs text-gray-900">{description}</p>
      )}

      <div className="flex items-center gap-1 text-xs">
        {languages.map(({ id, name, color }) => (
          <div
            className="flex flex-row items-center justify-center gap-1"
            key={id}
          >
            <svg
              aria-hidden="true"
              fill={color}
              height="10"
              viewBox="0 0 20 20"
              width="10"
            >
              <circle cx="10" cy="10" r="9.5" />
            </svg>
            <span className="font-mono">{name}</span>
          </div>
        ))}
      </div>
    </article>
  );
}
