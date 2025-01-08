import { useFetcher } from 'react-router';
import type { Route } from './+types/contact';
import ContentEntry from '~/components/website/ContentEntry';
import H2 from '~/components/website/H2';
import Section from '~/components/website/Section';

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();

  console.log('Sending email: ', formData);

  try {
    const response = await fetch(
      'https://email-with-resend.pepconde-1993.workers.dev/',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData,
      }
    );
    const x = await response.json();
    console.log('Email sent: ', x);
  } catch (error) {
    console.error('Error sending email: ', error);
  }
}

export default function Contact() {
  const fetcher = useFetcher();

  return (
    <Section>
      <H2>Contact</H2>
      <ContentEntry title="Get in touch!">
        Feel free to reach out to me via email at
        <fetcher.Form method="post" className="flex flex-col">
          <label>
            Your Email:
            <input type="email" name="email" required className="border" />
          </label>
          <label>
            Subject:
            <input type="text" name="subject" required className="border" />
          </label>
          <label>
            Message:
            <textarea name="text" required className="border" />
          </label>
          <button type="submit" className="border">
            Send
          </button>
        </fetcher.Form>
      </ContentEntry>
    </Section>
  );
}
