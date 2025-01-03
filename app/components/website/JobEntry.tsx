import Article from './Article';
import H3 from './H3';

export default function JobEntry({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <Article>
      <H3 title={title} subtitle={subtitle} />
      <p>{children}</p>
    </Article>
  );
}
