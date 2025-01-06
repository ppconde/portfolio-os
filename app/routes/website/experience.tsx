import H2 from '~/components/website/H2';
import ContentEntry from '~/components/website/ContentEntry';
import Section from '~/components/website/Section';
import A from '~/components/website/A';

export default function Experience() {
  return (
    <Section /* className="flex flex-col justify-center" */>
      <H2>Experience</H2>

      <ContentEntry
        title="Blip.pt - Frontend Engineer"
        subtitle="[2020-Present] - Porto"
      >
        I joined{' '}
        <A
          href="https://www.blip.pt/"
          ariaLabel="Visit Blip.pt website"
          title="This is a cool company!"
        >
          Blip.pt
        </A>
        , where I deepened my technical expertise and worked with a broad range
        of technologies, including{' '}
        <em>
          GraphQL, Node.js, TypeScript, PostgreSQL, React, Webpack, Jest, Redux
        </em>
        , and <em>Docker</em>. I contributed to unit and functional testing, and
        I planned and developed features for multiple apps catering to betting
        brands. This role not only expanded my technical skill set but also gave
        me the chance to work on complex systems and deliver value to end-users.
      </ContentEntry>

      <ContentEntry
        title="Altice Labs - Informatics Consultant"
        subtitle="[2018-2020] - Aveiro"
      >
        I began my professional journey at{' '}
        <A
          href="https://www.alticelabs.com/"
          ariaLabel="Visit Altice Labs website"
          title="This is another cool company!"
        >
          Altice Labs
        </A>
        , a company dedicated to creating innovative solutions for the
        telecommunications and IT sectors. During my time there, I was part of
        the Operations Support System team, where I gained valuable experience
        in organizing and planning XML workflows, developing product features,
        debugging systems, and writing technical specifications. It was a great
        opportunity to sharpen my problem-solving skills and collaborate on
        impactful projects.
      </ContentEntry>
    </Section>
  );
}
