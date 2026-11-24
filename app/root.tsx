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

const SITE = 'https://os.ppconde.com';
const TITLE = 'Pedro Conde · Software Engineer';
const DESCRIPTION =
  'Portfolio of Pedro Conde, a fullstack software engineer in Porto, built as a Windows 98 desktop: browse projects and experience, paint, or play Mancala with other visitors.';
const IMAGE = `${SITE}/img/og.png`;

export const meta: MetaFunction = () => [
  { title: TITLE },
  { name: 'description', content: DESCRIPTION },

  // Open Graph (also read by LinkedIn, Slack, Discord, X)
  { property: 'og:url', content: SITE },
  { property: 'og:type', content: 'website' },
  { property: 'og:site_name', content: 'Ppconde OS' },
  { property: 'og:title', content: TITLE },
  { property: 'og:description', content: DESCRIPTION },
  { property: 'og:image', content: IMAGE },
  { property: 'og:image:width', content: '1200' },
  { property: 'og:image:height', content: '630' },
  {
    property: 'og:image:alt',
    content: 'A Windows 98 desktop with a window titled My Portfolio',
  },
  { name: 'twitter:card', content: 'summary_large_image' },
];

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
