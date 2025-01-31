import { useFetcher, data } from 'react-router';
import type { Route } from './+types/contact';
import H2 from '~/components/website/H2';
import Section from '~/components/website/Section';
import { z } from 'zod';
import A from '~/components/website/A';
import { useEffect, useRef, useState } from 'react';

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
  const urlEncodedData = new URLSearchParams(
    Array.from(formData.entries()).map(([key, value]) => [
      key,
      value.toString(),
    ])
  ).toString();

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
      body: urlEncodedData,
    });
    return data({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error sending email: ', error);
    return data({ success: false, error }, { status: 500 });
  }
}

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
          message: 'Form submitted successfully!',
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
        Feel free to reach out to me via email at{' '}
        <A
          href="mailto:contact@ppconde.com"
          ariaLabel="My professional contact email"
          title="Send me an email!"
        >
          contact@ppconde.com
        </A>
        <fetcher.Form ref={formRef} method="post" className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-900"
            >
              <b>Your email</b>
            </label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="name@domain.com"
              required
              className="mt-1 block w-full border-gray-300 p-1 shadow-xs outline-dashed"
            />
            {errors?.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="subject"
              className="block text-sm font-medium text-gray-900"
            >
              <b>Subject</b>
            </label>
            <input
              id="subject"
              type="text"
              name="subject"
              placeholder="The subject of your message"
              required
              className="mt-1 block w-full border-gray-300 p-1 shadow-xs outline-dashed"
            />
            {errors?.subject && (
              <p className="mt-1 text-sm text-red-600">{errors.subject}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="text"
              className="block text-sm font-medium text-gray-900"
            >
              <b>Your message</b>
            </label>
            <textarea
              id="text"
              name="text"
              placeholder="Type your message here."
              required
              rows={5}
              className="mt-1 block w-full border-gray-300 p-1 shadow-xs outline-dashed"
            />
            {errors?.text && (
              <p className="mt-1 text-sm text-red-600">{errors.text}</p>
            )}
          </div>
          <button
            type="submit"
            className="btn-windows text-mono focus:btn-windows-inverted h-full px-4 py-1 text-sm"
          >
            Send
          </button>
        </fetcher.Form>
        {notification && (
          <div className="border-windows absolute right-2 top-24 w-full max-w-xs md:max-w-sm lg:max-w-md">
            <div className="h-3 items-center justify-between bg-windows-blue px-1"></div>
            <div className="flex flex-row items-center justify-evenly bg-windows-gray-primary p-3 font-ms-reference shadow-md">
              {notification.type === 'success' ? (
                <img
                  src="/assets/check-0.png"
                  alt=""
                  className="w-5 object-cover md:w-6"
                />
              ) : (
                <img
                  src="/assets/msg_error-0.png"
                  alt=""
                  className="w-5 object-cover md:w-6"
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
