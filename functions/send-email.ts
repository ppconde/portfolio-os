// eslint-disable-next-line import/no-unresolved
import { EmailMessage } from 'cloudflare:email';
import { createMimeMessage } from 'mimetext';

export default {
  async fetch(
    request: unknown,
    env: { SEB: { send: (arg0: EmailMessage) => unknown } }
  ) {
    const msg = createMimeMessage();
    msg.setSender({ name: 'Test', addr: 'niviy86779@matmayer.com' });
    msg.setRecipient('contact@ppconde.com');
    msg.setSubject('An email generated in a worker');
    msg.addMessage({
      contentType: 'text/plain',
      data: `Congratulations, you just sent an email from a worker.`,
    });

    const message = new EmailMessage(
      'niviy86779@matmayer.com',
      'contact@ppconde.com',
      msg.asRaw()
    );
    try {
      await env.SEB.send(message);
    } catch (e) {
      if (e instanceof Error) {
        return new Response(e.message);
      }
      return new Response('An unknown error occurred');
    }

    return new Response('Hello Send Email World!');
  },
};
