import H2 from '~/components/website/H2';
import Section from '~/components/website/Section';
import A from '~/components/website/A';
import ContentEntry from '~/components/website/ContentEntry';
import HR from '~/components/website/HR';

export default function About() {
  return (
    <Section>
      <H2>About</H2>
      <ContentEntry
        title="University of Aveiro"
        subtitle="[2011-2017] - Aveiro"
      >
        I graduated with a masters degree in{' '}
        <strong>Electronics and Telecommunications Engineering</strong> from the{' '}
        <A
          href="https://www.ua.pt/"
          ariaLabel="Visit University of Aveiro website"
          title="This is a cool university!"
        >
          University of Aveiro
        </A>{' '}
        During my studies, I had the opportunity to explore diverse areas such
        as electronics, telecommunications, computer vision, and more.
        <br />
        And as a result, I worked on my thesis project called{' '}
        <strong>Neuromuscular Tracking by Ultrasound Imaging</strong> in the
        field of computer vision where I developed an application using{' '}
        <strong>C++</strong> and <strong>OpenCV</strong> to track and quantify
        human nerve-structure displacement in real-time.
      </ContentEntry>

      <ContentEntry
        title="Erasmus Programme TalTech"
        subtitle="[2015-2015] - Tallinn"
      >
        During my studies, I had the opportunity to participate in the Erasmus
        programme at{' '}
        <A
          href="https://taltech.ee/"
          ariaLabel="Visit TalTech website"
          title="Tallinn University of Technology"
        >
          TalTech
        </A>{' '}
        in Estonia. This international experience enriched my academic journey,
        allowing me to study in a different cultural context while gaining
        valuable global perspectives. It also influenced personally to join ESN
        Aveiro.
      </ContentEntry>

      <ContentEntry
        title="EDIT - Disruptive Digital Education"
        subtitle="[2019-2019]"
      >
        Seeking to combine my technical background with creative work, I
        completed an intensive Frontend Development course at{' '}
        <A
          href="https://weareedit.io/"
          ariaLabel="Visit EDIT website"
          title="EDIT - Disruptive Digital Education"
        >
          EDIT
        </A>
        . The program covered essential web technologies including{' '}
        <strong>UX/UI fundamentals</strong>, <strong>HTML5</strong>,{' '}
        <strong>CSS3</strong>, <strong>Responsive Design</strong>,{' '}
        <strong>JavaScript</strong>, <strong>jQuery</strong> and{' '}
        <strong>React</strong>.
      </ContentEntry>

      <HR />

      <ContentEntry
        title="Volunteering"
        subtitle="[2016-2018] - Aveiro"
        img="/assets/esnaveiro.jpg"
        caption="Figure 1: Raising awareness of the importance of terrain management in wildfire prevention, an initiative by ESN Aveiro."
      >
        During my university years, I was actively involved with{' '}
        <A
          href="https://www.esn.org/"
          ariaLabel="Visit ESN website"
          title="Erasmus Student Network - International Student Organization"
        >
          Erasmus Student Network
        </A>{' '}
        Aveiro, a non-profit youth association that supports international
        student mobility. Over two years, I wore multiple hats:
        <ul className="mt-4 list-disc space-y-4 pl-6">
          <li>
            As <strong>Marketing and Communication Manager</strong>, I led
            campaigns reaching <strong>7000+ followers</strong>, managed social
            media presence, and coordinated promotional strategies for{' '}
            <strong>130+</strong> local events. I was also responsible for
            designing merchandise and promoting the Erasmus+ Programme.
          </li>
          <li>
            As a core member, I participated in team management for 40+ students
            and organized various cultural and social activities for 300+
            international students. I also contributed to the{' '}
            <strong>Human Resources Working Group</strong>, helping develop and
            implement management strategies.
          </li>
        </ul>
      </ContentEntry>
    </Section>
  );
}
