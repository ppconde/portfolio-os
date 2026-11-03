import { useEffect, useRef, useState } from 'react';
import { data, useFetcher } from 'react-router';
import { z } from 'zod';
import A from '~/components/website/A';
import H2 from '~/components/website/H2';
import Section from '~/components/website/Section';
import type { Route } from './+types/contact';

export async function action({ request }: Route.ActionArgs) {
  const formSchema = z
    .object({
      subject: z
        .string()
        .min(3, 'Subject must be at least 3 characters long')
        .max(100, 'Subject cannot exceed 100 characters'),
      email: z.string().email('Invalid email address'),
      text: z
        .string()
        .min(10, 'Message must be at least 10 characters long')
        .max(1000, 'Message cannot exceed 1000 characters'),
    })
    .strict();

  const formData = await request.formData();
  const entries = Object.fromEntries(formData.entries());
  const parseResult = formSchema.safeParse(entries);

  if (!parseResult.success) {
    const errors = parseResult.error.flatten().fieldErrors;
    return data({ errors: errors }, { status: 400 });
  }

  try {
    await fetch('https://email-with-resend.pepconde-1993.workers.dev/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(parseResult.data),
    });
    return data({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error sending email: ', error);
    return data({ success: false, error }, { status: 500 });
  }
}

const field =
  'border-t-quaternary border-l-quaternary border-r-secondary border-b-secondary mt-1 block w-full border-2 bg-white px-2 py-1 shadow-[inset_1px_1px_#000] placeholder:text-gray-500 focus-visible:outline-offset-0';

export default function Contact() {
  const fetcher = useFetcher();
  const errors = fetcher.data?.errors;

  const formRef = useRef<HTMLFormElement>(null);

  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);

  useEffect(() => {
    if (fetcher.state === 'idle') {
      if (fetcher.data && !errors) {
        setNotification({
          message: 'Email sent successfully!',
          type: 'success',
        });
      } else if (errors) {
        setNotification({
          message: 'There was an error with your submission.',
          type: 'error',
        });
      }
    }
  }, [fetcher.state, fetcher.data, errors]);

  // Auto-hide the notification after 3 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      if (notification.type === 'success') {
        formRef.current?.reset(); // Resets all form fields to their initial state
      }
      return () => clearTimeout(timer);
    }
  }, [notification]);

  return (
    <Section>
      <H2>Contact</H2>
      <Section>
        <p>
          Feel free to reach out to me via email at{' '}
          <A
            ariaLabel="My professional contact email"
            href="mailto:contact@ppconde.com"
            title="Send me an email!"
          >
            contact@ppconde.com
          </A>
        </p>
        <fetcher.Form className="space-y-6" method="post" ref={formRef}>
          <div>
            <label
              className="block text-sm font-medium text-gray-900"
              htmlFor="email"
            >
              <b>Your email</b>
            </label>
            <input
              className={field}
              id="email"
              name="email"
              placeholder="name@domain.com"
              required
              type="email"
            />
            {errors?.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>
          <div>
            <label
              className="block text-sm font-medium text-gray-900"
              htmlFor="subject"
            >
              <b>Subject</b>
            </label>
            <input
              className={field}
              id="subject"
              name="subject"
              placeholder="The subject of your message"
              required
              type="text"
            />
            {errors?.subject && (
              <p className="mt-1 text-sm text-red-600">{errors.subject}</p>
            )}
          </div>
          <div>
            <label
              className="block text-sm font-medium text-gray-900"
              htmlFor="text"
            >
              <b>Your message</b>
            </label>
            <textarea
              className={field}
              id="text"
              name="text"
              placeholder="Type your message here."
              required
              rows={5}
            />
            {errors?.text && (
              <p className="mt-1 text-sm text-red-600">{errors.text}</p>
            )}
          </div>
          <button
            className="btn-windows active:btn-windows-inverted px-6 py-1 text-sm text-gray-900 disabled:text-gray-500"
            disabled={fetcher.state !== 'idle'}
            type="submit"
          >
            {fetcher.state === 'idle' ? 'Send' : 'Sending...'}
          </button>
        </fetcher.Form>
        {notification && (
          <div className="border-windows absolute top-24 right-2 w-full max-w-xs md:max-w-sm lg:max-w-md">
            <div className="bg-accent h-3 items-center justify-between px-1"></div>
            <div className="bg-secondary font-ms-reference flex flex-row items-center justify-evenly p-3 shadow-md">
              {notification.type === 'success' ? (
                <img
                  alt=""
                  className="w-5 object-cover md:w-6"
                  src="/assets/check-0.png"
                />
              ) : (
                <img
                  alt=""
                  className="w-5 object-cover md:w-6"
                  src="/assets/msg_error-0.png"
                />
              )}
              <p className="text-center text-sm md:mt-0 md:text-left md:text-base">
                {notification.message}
              </p>
            </div>
          </div>
        )}
      </Section>
    </Section>
  );
}
