import type { Config } from '@react-router/dev/config';

export default {
  ssr: true,
  future: {
    unstable_viteEnvironmentApi: true,
  },
  async prerender() {
    return ['/', '/about', '/contact', '/experience', '/home'];
  },
} satisfies Config;
