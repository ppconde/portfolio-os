import Article from './Article';
import H3 from './H3';

export default function ContentEntry({
  title,
  subtitle,
  img,
  caption,
  children,
}: {
  title: string;
  subtitle?: string;
  img?: string;
  caption?: string;
  children: React.ReactNode;
}) {
  return (
    <Article>
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="flex-1">
          <H3>
            {title}
            {subtitle && <p className="mt-4 text-xs">{subtitle}</p>}
          </H3>
          <div>{children}</div>
        </div>
        {img && (
          <figure className="flex-1">
            <img src={img} alt={title} className="h-auto w-full object-cover" />
            {caption && (
              <figcaption className="mt-2 text-center text-xs">
                {caption}
              </figcaption>
            )}
          </figure>
        )}
      </div>
    </Article>
  );
}
