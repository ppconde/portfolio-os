import { Form, useFetcher } from 'react-router';
import type { Route } from './+types/contact';
import ContentEntry from '~/components/website/ContentEntry';
import H2 from '~/components/website/H2';
import Section from '~/components/website/Section';

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const { email, subject, message } = Object.fromEntries(formData.entries());
  const body = JSON.stringify({ subject, email, message });
  console.log('Sending email: ', body);
  try {
    const response = await fetch(
      'https://send-email.pepconde-1993.workers.dev/',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
      }
    );

    console.log('Email sent:', response.ok);

    if (!response.ok) {
      const { error } = (await response.json()) as {
        error: { message: string };
      };
      return new Response(error.message || 'Failed to send email', {
        status: 500,
      });
    }

    return new Response('Success', { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response('Failed to send email', { status: 500 });
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
            <textarea name="message" required className="border" />
          </label>
          <button type="submit" className="border">
            Send
          </button>
        </fetcher.Form>
      </ContentEntry>
    </Section>
  );
}
