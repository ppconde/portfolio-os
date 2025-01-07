import { useFetcher } from 'react-router';
import type { Route } from './+types/contact';
import ContentEntry from '~/components/website/ContentEntry';
import H2 from '~/components/website/H2';
import Section from '~/components/website/Section';

export function action({ params }: Route.ComponentProps) {
  return params;
}

export default function Contact() {
  const fetcher = useFetcher();

  return (
    <Section>
      <H2>Contact</H2>
      <ContentEntry title="Get in touch!">
        Feel free to reach out to me via email at
        <fetcher.Form method="post" action="/website/contact">
          <label>
            Your Email:
            <input type="email" name="email" required className="border" />
          </label>
          <label>
            Message:
            <textarea name="message" required className="border"></textarea>
          </label>
          <button type="submit" className="border">
            Send
          </button>
        </fetcher.Form>
      </ContentEntry>
    </Section>
  );
}
