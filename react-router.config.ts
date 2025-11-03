import type { Config } from '@react-router/dev/config';

export default {
  appDirectory: './src',
  ssr: true,
  future: {
    unstable_viteEnvironmentApi: true,
  },
  async prerender() {
    return ['/home', '/about', '/contact', '/experience'];
  },
} satisfies Config;
