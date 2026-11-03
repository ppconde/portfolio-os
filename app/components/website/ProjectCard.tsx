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
    <div className="card-shadow flex w-full max-w-md flex-col justify-between gap-2 border border-gray-800 bg-white p-2 text-sm">
      {homepageUrl && (
        <A
          ariaLabel={`View ${name} site`}
          href={homepageUrl}
          title={`View ${name} site`}
        >
          <img
            alt="OpenGraph preview"
            className="max-h-full w-auto rounded object-contain"
            src={openGraphImageUrl}
          />
        </A>
      )}

      <div className="flex items-center justify-between">
        <A
          ariaLabel={`View ${name} on GitHub`}
          href={url}
          title={`View ${name} on GitHub`}
        >
          <strong>{name}</strong>
        </A>
      </div>

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
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="10" cy="10" r="9.5" />
            </svg>
            <span className="font-mono">{name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
