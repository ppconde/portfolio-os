import H2 from '~/components/website/H2';
import ContentEntry from '~/components/website/ContentEntry';
import Section from '~/components/website/Section';
import A from '~/components/website/A';

export default function Experience() {
  return (
    <Section>
      <H2>Experience</H2>
      <ContentEntry
        title="Blip.pt - Software Engineer"
        subtitle="[2020-Present] - Porto"
      >
        At{' '}
        <A
          href="https://www.blip.pt/"
          ariaLabel="Visit Blip.pt website"
          title="This is a cool company!"
        >
          Blip.pt
        </A>{' '}
        I worked with technologies like{' '}
        <strong>
          <em>React, TypeScript, Redux, GraphQL, Node.js</em>
        </strong>{' '}
        and{' '}
        <strong>
          <em>PostgreSQL</em>
        </strong>{' '}
        to build and maintain software for{' '}
        <A
          href="https://www.paddypower.com/bet"
          ariaLabel="Visit Paddy PowerPaddy's website"
          title="Visit Paddy Power – Innovative and entertaining sports betting platform"
        >
          PaddyPower
        </A>
        &apos;s retail betting shops across <strong>700+</strong> locations. I
        contributed to both legacy and greenfield projects, focusing on
        reliability through unit, visual and regression testing. I also helped
        build internal tools such as the fullstack{' '}
        <strong>Device Management App</strong> and developed a{' '}
        <strong>multithreaded Node.js ping monitor</strong> — originally a
        hackathon project — used by our team to track device availability.
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
        the <strong>Operations Support System</strong> (OSS) team, where I
        developed workflows using{' '}
        <strong>
          <em>XML/XSLT</em>
        </strong>{' '}
        for <em>APIs</em> used in network management, debugged systems and wrote
        technical specifications.
      </ContentEntry>
    </Section>
  );
}
