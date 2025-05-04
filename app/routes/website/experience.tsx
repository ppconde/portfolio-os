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
        </A>
        , I helped design, build, and maintain software for{' '}
        <A
          href="https://www.paddypower.com/bet"
          ariaLabel="Visit Paddy Power's website"
          title="Visit Paddy Power – Innovative and entertaining sports betting platform"
        >
          Paddy Power
        </A>{' '}
        retail shops, supporting <strong>700+ locations</strong> across the UK
        and Ireland. I worked on both legacy and greenfield projects, with a
        strong focus on reliability through unit, visual, and regression
        testing.
        <ul className="mt-4 list-disc space-y-4 pl-6">
          <li>
            Maintained the <strong>Customer Interface Terminal</strong>, a web
            app on Android tablets used by customers to check live race and
            sports results.
          </li>
          <li>
            Helped build the <strong>Device Management App</strong>, a fullstack
            internal tool for configuring and managing shop screens remotely.
          </li>
          <li>
            Created a <strong>multithreaded Node.js ping monitor</strong> during
            a hackathon—now used by our team to track device availability across
            all locations.
          </li>
        </ul>
        <br />
        <strong>Skills:</strong> React, TypeScript, Redux, GraphQL, Node.js,
        PostgreSQL
      </ContentEntry>

      <ContentEntry
        title="Altice Labs - Informatics Consultant"
        subtitle="[2018-2020] - Aveiro"
      >
        At{' '}
        <A
          href="https://www.alticelabs.com/"
          ariaLabel="Visit Altice Labs website"
          title="This is another cool company!"
        >
          Altice Labs
        </A>
        , I joined the <strong>Operations Support System</strong> team, where I
        developed API workflows and debugged systems for telecom network
        management. I also contributed to technical documentation and service
        integration.
        <br />
        <strong>Skills:</strong> XML, XSLT, XPath, Java, SoapUI, WireMock
      </ContentEntry>
    </Section>
  );
}
