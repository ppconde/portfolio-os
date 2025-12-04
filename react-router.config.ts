import type { Config } from '@react-router/dev/config';

export default {
  ssr: true,
  future: {
    v8_viteEnvironmentApi: true,
  },
  async prerender() {
    return ['/home', '/about', '/contact', '/experience'];
  },
} satisfies Config;
