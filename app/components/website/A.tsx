export default function A({
  href,
  ariaLabel,
  children,
  title,
}: {
  href: string;
  ariaLabel: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <a
      aria-label={ariaLabel}
      className="text-accent-light underline hover:no-underline"
      href={href}
      rel="noopener noreferrer"
      target="_blank"
      title={title}
    >
      {children}
    </a>
  );
}
