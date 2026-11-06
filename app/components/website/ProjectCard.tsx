import type { Project } from '~/normalizers/pinned-repos.normalizer';
import A from './A';

// A small Win98 panel: raised frame, sunken preview well, status-bar footer.
export default function ProjectCard({
  name,
  description,
  url,
  homepageUrl,
  openGraphImageUrl,
  languages,
}: Project) {
  return (
    <article className="border-windows bg-secondary flex w-full max-w-md flex-col gap-2 p-1 text-sm">
      {homepageUrl && (
        <A
          ariaLabel={`View ${name} site`}
          href={homepageUrl}
          title={`View ${name} site`}
        >
          <img
            alt={`${name} preview`}
            className="border-windows-sunken block h-auto w-full border-2 bg-white"
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

      <div className="flex grow flex-col gap-1 px-1">
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
          <p className="font-mono text-xs text-gray-900">{description}</p>
        )}
      </div>

      {languages.length > 0 && (
        <div className="border-windows-sunken flex min-h-5 flex-wrap items-center gap-x-2 border px-1 text-xs">
          {languages.map(({ id, name, color }) => (
            <span className="flex items-center gap-1" key={id}>
              <svg
                aria-hidden="true"
                fill={color}
                height="10"
                viewBox="0 0 20 20"
                width="10"
              >
                <circle cx="10" cy="10" r="9.5" />
              </svg>
              {name}
            </span>
          ))}
        </div>
      )}
    </article>
  );
}
