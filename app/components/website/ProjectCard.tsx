import A from './A';

type ProjectCardProps = {
  name: string;
  description: string;
  url: string;
  stargazerCount: number;
  homepageUrl?: string;
  openGraphImageUrl: string;
  languages: LanguageType[];
};

type LanguageType = {
  id: string;
  name: string;
  color: string;
};

export default function ProjectCard({
  name,
  description,
  url,
  stargazerCount,
  homepageUrl,
  openGraphImageUrl,
  languages,
}: ProjectCardProps) {
  return (
    <div className="card-shadow w-full max-w-md border border-gray-800 bg-white p-2 text-sm">
      <div className="mb-2 flex items-center justify-between">
        <div>
          <A
            href={url}
            ariaLabel={`View ${name} on GitHub`}
            title={`View ${name} on GitHub`}
          >
            {name}
          </A>
        </div>
        <div className="text-xs text-gray-700">★ {stargazerCount}</div>
      </div>

      {/* <img src={openGraphImageUrl} alt="OpenGraph preview" /> */}

      <p className="mb-2 font-mono text-xs">{description}</p>

      <div className="vertical-align-middle flex items-center justify-between text-xs">
        <div className="flex flex-wrap gap-1">
          {languages.map(({ id, name, color }) => (
            <div
              key={id}
              className="flex flex-row items-center justify-center gap-1"
            >
              <svg
                className={`text-[${color}]`}
                width="10"
                height="10"
                viewBox="0 0 20 20"
                fill="none"
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
        <A
          href={homepageUrl}
          ariaLabel={`View ${name} site`}
          title={`View ${name} site`}
        >
          View site
        </A>
      </div>
    </div>
  );
}
