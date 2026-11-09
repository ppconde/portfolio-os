export default function ContentEntry({
  title,
  subtitle,
  img,
  caption,
  children,
}: {
  title?: string;
  subtitle?: string;
  img?: string;
  caption?: string;
  children: React.ReactNode;
}) {
  return (
    <article className="my-8 text-pretty">
      <div className="flex flex-col gap-4 lg:flex-row">
        <div className="flex-1">
          <h3 className="font-ps-sans-nouveaux my-4 text-base font-bold text-gray-900">
            {title}
            {subtitle && <p className="mt-4 text-xs">{subtitle}</p>}
          </h3>
          <div>{children}</div>
        </div>
        {img && (
          <figure className="flex flex-1 flex-col items-center justify-center">
            <img
              alt={title}
              className="max-h-96 w-auto max-w-full object-contain"
              src={img}
            />
            {caption && (
              <figcaption className="mt-2 text-center text-xs">
                {caption}
              </figcaption>
            )}
          </figure>
        )}
      </div>
    </article>
  );
}
