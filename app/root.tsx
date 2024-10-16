import type { LinksFunction, MetaFunction } from '@remix-run/cloudflare'
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react'

import './tailwind.css'
import { useBootingEffect } from './hooks/use-booting-effect'
import Boot from './components/Boot'
import Desktop from './components/Desktop'

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
    href: 'https://fonts.googleapis.com/css2?family=Micro+5&display=swap', // Double-check if this font is available
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
]

export const meta: MetaFunction = () => {
  return [
    { title: 'Ppconde OS' },
    { name: 'description', content: 'Welcome to Ppconde OS' },
  ]
}

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
  )
}

export default function App() {
  const isProd = process.env.NODE_ENV === 'production'
  const isBooting = useBootingEffect()
  return (
    <Layout>
      {isProd ? (
        isBooting ? (
          <Boot />
        ) : (
          <Desktop>
            <Outlet />
          </Desktop>
        )
      ) : (
        <Desktop>
          <Outlet />
        </Desktop>
      )}
    </Layout>
  )
}
