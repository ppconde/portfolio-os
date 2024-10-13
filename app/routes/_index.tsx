import type { LoaderFunction, MetaFunction } from '@remix-run/cloudflare'
import Desktop from '~/routes/desktop'
import { json } from '@remix-run/cloudflare'

import Boot from './boot'
import { useEffect, useState } from 'react'

export const meta: MetaFunction = () => {
  return [
    { title: 'Ppconde OS' },
    { name: 'description', content: 'Welcome to Ppconde OS' },
  ]
}

export const loader: LoaderFunction = async ({ context }) => {
  const { env } = context.cloudflare
  const { results } = await env.DB.prepare('SELECT * FROM posts LIMIT 5').all()
  return json(results)
}

export default function Index() {
  const [isBooting, setIsBooting] = useState(true)

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsBooting(false)
    }, 3000)
    return () => clearTimeout(timeout)
  }, [isBooting])

  return isBooting ? <Boot /> : <Desktop />
}
