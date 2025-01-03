export default function About() {
  return (
    <section className="space-y-6 font-mono text-sm text-gray-600">
      <article>
        <h2 className="pb-4 font-ps-sans-nouveaux text-3xl font-bold text-gray-900">
          About Me
        </h2>
        <p>
          My name is Pedro and I&apos;m a Software Engineer currently working at{' '}
          <a
            href="https://www.blip.pt/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Visit Blip.pt website"
            className="text-window-super-blue underline hover:no-underline"
            title="This is a cool company!"
          >
            Blip.pt
          </a>
          . I graduated in Electronics and Telecommunications Engineering from
          the{' '}
          <a
            href="https://www.ua.pt/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Visit University of Aveiro website"
            className="text-window-super-blue underline hover:no-underline"
            title="This is a cool university!"
          >
            University of Aveiro
          </a>{' '}
          in 2017.
        </p>
      </article>
    </section>
  );
}
