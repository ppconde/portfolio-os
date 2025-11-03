export default function Section({ children }: { children: React.ReactNode }) {
  return (
    <section className="space-y-6 font-mono text-sm text-gray-600">
      {children}
    </section>
  );
}
