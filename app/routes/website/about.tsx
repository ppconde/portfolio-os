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

      <h3 className="border-t pt-4 font-ps-sans-nouveaux text-2xl font-bold text-gray-900">
        Experience
      </h3>
      <article>
        <h4 className="mb-4 font-ps-sans-nouveaux font-bold text-gray-900">
          Altice Labs
        </h4>
        <p>
          I began my professional journey at <strong>Altice Labs</strong>, a
          company dedicated to creating innovative solutions for the
          telecommunications and IT sectors. During my time there, I was part of
          the Operations Support System team, where I gained valuable experience
          in organizing and planning XML workflows, developing product features,
          debugging systems, and writing technical specifications. It was a
          great opportunity to hone my problem-solving skills and collaborate on
          impactful projects.
        </p>
      </article>

      <article>
        <h4 className="mb-4 font-ps-sans-nouveaux font-bold text-gray-900">
          Blip.pt
        </h4>
        <p>
          Afterward, I joined <strong>Blip.pt</strong>, where I deepened my
          technical expertise and worked with a broad range of technologies,
          including{' '}
          <em>
            GraphQL, Node.js, TypeScript, PostgreSQL, React, Webpack, Jest,
            Redux
          </em>
          , and <em>Docker</em>. I contributed to unit and functional testing,
          and I planned and developed features for multiple apps catering to
          betting brands. This role not only expanded my technical skill set but
          also gave me the chance to work on complex systems and deliver value
          to end-users.
        </p>
      </article>
    </section>
  );
}
