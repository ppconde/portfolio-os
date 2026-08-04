import type { Maybe } from 'graphql/jsutils/Maybe';
import A from './A';

type ProjectCardProps = {
  name?: string;
  description?: Maybe<string>;
  url?: string;
  homepageUrl?: Maybe<string>;
  openGraphImageUrl?: string;
  languages?: LanguageType[];
};

type LanguageType = {
  id: string;
  name: string;
  color: Maybe<string>;
};

export default function ProjectCard({
  name,
  description,
  url,
  homepageUrl,
  openGraphImageUrl,
  languages,
}: ProjectCardProps) {
  return (
    <div className="card-shadow flex w-full max-w-md flex-col justify-between gap-2 border border-gray-800 bg-white p-2 text-sm">
      {openGraphImageUrl && homepageUrl && (
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
        {url ? (
          <A
            ariaLabel={`View ${name ?? 'project'} on GitHub`}
            href={url}
            title={`View ${name ?? 'project'} on GitHub`}
          >
            <strong>{name}</strong>
          </A>
        ) : (
          <span>{name}</span>
        )}
      </div>

      {description && (
        <p className="grow font-mono text-gray-900 text-xs">{description}</p>
      )}

      <div className="flex items-center justify-between text-xs">
        {languages?.length ? (
          <div className="flex items-center gap-1">
            {languages.map(({ id, name, color }) => (
              <div
                className="flex flex-row items-center justify-center gap-1"
                key={id}
              >
                <svg
                  aria-hidden="true"
                  fill="none"
                  height="10"
                  style={{ color: color ?? 'currentColor' }}
                  viewBox="0 0 20 20"
                  width="10"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g>
                    <path
                      d="M19.5 10C19.5 15.2467 15.2467 19.5 10 19.5C4.75329 19.5 0.5 15.2467 0.5 10C0.5 4.75329 4.75329 0.5 10 0.5C15.2467 0.5 19.5 4.75329 19.5 10Z"
                      fill="currentColor"
                    />
                  </g>
                </svg>
                <span className="font-mono">{name}</span>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
