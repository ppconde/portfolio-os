import A from '~/components/website/A';
import ContentEntry from '~/components/website/ContentEntry';
import H2 from '~/components/website/H2';
import Section from '~/components/website/Section';

export default function Experience() {
  return (
    <Section>
      <H2>Experience</H2>
      <ContentEntry
        subtitle="[2024-Present] - Porto"
        title="Blip.pt - Software Engineer"
      >
        Joined a new team supporting the web platforms of{' '}
        <strong>PaddyPower</strong>, <strong>Betfair</strong>, and{' '}
        <strong>Sky Betting & Gaming</strong>. Took on a more active role in
        technical decisions and team coordination. Contributed to{' '}
        <strong>TBD</strong>, a <strong>multi-brand</strong> and{' '}
        <strong>cross-platform</strong> (web and native) feature powered by{' '}
        <strong>Prismic</strong>, enabling content teams to customize content
        across Betfair and SkyBet&apos;s websites and apps. Built in
        collaboration with multiple teams, it was both technically and
        communication-wise demanding.
        <br />
        <br />
        <strong>Skills:</strong> React, React Native, TypeScript, Redux Saga,
        GraphQL, Jest
      </ContentEntry>

      <ContentEntry
        subtitle="[2020-2024] - Porto"
        title="Blip.pt - Software Engineer"
      >
        At{' '}
        <A
          ariaLabel="Visit Blip.pt website"
          href="https://www.blip.pt/"
          title="This is a cool company!"
        >
          Blip.pt
        </A>
        , I helped design, build, and maintain software for{' '}
        <A
          ariaLabel="Visit Paddy Power's website"
          href="https://www.paddypower.com/bet"
          title="Visit Paddy Power - Innovative and entertaining sports betting platform"
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
        <strong>Skills:</strong> React, TypeScript, GraphQL, Node.js, PostgreSQL
      </ContentEntry>

      <ContentEntry
        subtitle="[2018-2020] - Aveiro"
        title="Altice Labs - Informatics Consultant"
      >
        Joined the <strong>Operations Support System</strong> team at{' '}
        <A
          ariaLabel="Visit Altice Labs website"
          href="https://www.alticelabs.com/"
          title="This is another cool company!"
        >
          Altice Labs
        </A>
        , where I developed and debugged API workflows used for telecom network
        management. Also wrote technical specs and supported service
        integration.
        <br />
        <br />
        <strong>Skills:</strong> XML, XSLT, XPath, Java, SoapUI, WireMock
      </ContentEntry>
    </Section>
  );
}
