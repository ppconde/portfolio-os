import type { Config } from '@react-router/dev/config';

export default {
  ssr: true,
  future: {
    unstable_viteEnvironmentApi: true,
  },
  async prerender() {
    return ['/website/about', '/website/contact', '/website/experience'];
  },
} satisfies Config;
