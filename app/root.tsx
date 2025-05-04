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
    // HTML Meta Tags
    { title: 'Ppconde OS' },
    { name: 'description', content: 'Welcome to Ppconde OS' },

    // Facebook Meta Tags (Open Graph)
    { property: 'og:url', content: 'https://os.ppconde.com' },
    { property: 'og:type', content: 'website' },
    { property: 'og:title', content: 'Ppconde OS' },
    { property: 'og:description', content: 'Welcome to Ppconde OS' },
    {
      property: 'og:image',
      content:
        'https://opengraph.b-cdn.net/production/images/bc9e9f06-566a-40dc-9f5c-c89f66a248d5.png?token=YralvLNChoeHjsV1Hd53yqCD6FvXWQhnGOgP9GQ1yKQ&height=540&width=1200&expires=33282368367',
    },

    // Twitter Meta Tags
    { name: 'twitter:card', content: 'summary_large_image' },
    { property: 'twitter:domain', content: 'os.ppconde.com' },
    { property: 'twitter:url', content: 'https://os.ppconde.com' },
    { name: 'twitter:title', content: 'Ppconde OS' },
    { name: 'twitter:description', content: 'Welcome to Ppconde OS' },
    {
      name: 'twitter:image',
      content:
        'https://opengraph.b-cdn.net/production/images/bc9e9f06-566a-40dc-9f5c-c89f66a248d5.png?token=YralvLNChoeHjsV1Hd53yqCD6FvXWQhnGOgP9GQ1yKQ&height=540&width=1200&expires=33282368367',
    },
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
