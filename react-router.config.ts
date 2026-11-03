import type { Config } from '@react-router/dev/config';

export default {
  prerender: ['/home', '/about', '/contact', '/experience'],
} satisfies Config;
