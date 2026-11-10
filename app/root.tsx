import type { LinksFunction, MetaFunction } from 'react-router';
import { Links, Meta, Scripts, ScrollRestoration } from 'react-router';

import './tailwind.css';
import type { Route } from './+types/root';
import BlueScreen from './components/OS/BlueScreen';
import { Screen } from './components/OS/Screen';
import microFont from './fonts/micro5-latin.woff2?url';
import dosWinFont from './fonts/perfect-dos-vga-437-win.woff?url';

export const links: LinksFunction = () => [
  {
    rel: 'preload',
    href: dosWinFont,
    as: 'font',
    type: 'font/woff',
    crossOrigin: 'anonymous',
  },
  {
    rel: 'preload',
    href: microFont,
    as: 'font',
    type: 'font/woff2',
    crossOrigin: 'anonymous',
  },
  // Website headers: otherwise only fetched when a window first renders one, so they'd swap in visibly.
  {
    rel: 'preload',
    href: 'https://fonts.cdnfonts.com/s/7527/px_sans_nouveaux.woff',
    as: 'font',
    type: 'font/woff',
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
        'https://repository-images.githubusercontent.com/870859488/48c376c0-ef9e-4197-8912-f5c4cbeafc51',
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
        'https://repository-images.githubusercontent.com/870859488/48c376c0-ef9e-4197-8912-f5c4cbeafc51',
    },
  ];
};

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta content="width=device-width, initial-scale=1" name="viewport" />
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
  return <Screen />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  return <BlueScreen error={error} />;
}
