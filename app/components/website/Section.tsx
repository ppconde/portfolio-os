export default function Section({ children }: { children: React.ReactNode }) {
  return (
    <section className="space-y-6 font-mono text-gray-600 text-sm">
      {children}
    </section>
  );
}
