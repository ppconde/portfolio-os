export default function H3({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <h3 className="my-4 font-ps-sans-nouveaux text-base font-bold text-gray-900">
      {title}
      <p className="mt-4 text-xs">{subtitle}</p>
    </h3>
  );
}
