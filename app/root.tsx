import type { LinksFunction, MetaFunction } from 'react-router';
import { Links, Meta, Scripts, ScrollRestoration } from 'react-router';

import './tailwind.css';
import { Screen } from './components/Screen';
import BootProvider from './contexts/BootContext';

export const links: LinksFunction = () => [
  {
    rel: 'preconnect',
    href: 'https://fonts.googleapis.com',
  },
  {
    rel: 'preconnect',
    href: 'https://fonts.gstatic.com',
    crossOrigin: 'anonymous',
  },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Micro+5&display=swap',
    crossOrigin: 'anonymous',
  },
  {
    rel: 'stylesheet',
    href: 'https://fonts.cdnfonts.com/css/px-sans-nouveaux',
    crossOrigin: 'anonymous',
  },
  {
    rel: 'stylesheet',
    href: 'https://fonts.cdnfonts.com/css/perfect-dos-vga-437',
    crossOrigin: 'anonymous',
  },
  {
    rel: 'stylesheet',
    href: 'https://fonts.cdnfonts.com/css/ms-reference-sans-serif',
    crossOrigin: 'anonymous',
  },
];

export const meta: MetaFunction = () => {
  return [
    { title: 'Ppconde OS' },
    { name: 'description', content: 'Welcome to Ppconde OS' },
  ];
};

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <BootProvider>
      <Screen />
    </BootProvider>
  );
}
