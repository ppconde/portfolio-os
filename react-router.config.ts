import type { Config } from '@react-router/dev/config';

export default {
  ssr: true,
  async prerender() {
    return ['/home', '/about', '/contact', '/experience'];
  },
} satisfies Config;