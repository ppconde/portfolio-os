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
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      className="text-windows-super-blue underline hover:no-underline"
      title={title}
    >
      {children}
    </a>
  );
}
