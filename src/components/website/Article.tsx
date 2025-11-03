export default function Article({ children }: { children: React.ReactNode }) {
  return <article className="my-8 text-pretty">{children}</article>;
}
