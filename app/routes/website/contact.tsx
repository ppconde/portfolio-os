import { Form } from 'react-router';
import ContentEntry from '~/components/website/ContentEntry';
import H2 from '~/components/website/H2';
import Section from '~/components/website/Section';

export default function Contact() {
  return (
    <Section>
      <H2>Contact</H2>
      <ContentEntry title="Get in touch!">
        Feel free to reach out to me via email at <Form action="POST"></Form>
        <Form method="post" action="/send-email">
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
        </Form>
      </ContentEntry>
    </Section>
  );
}
