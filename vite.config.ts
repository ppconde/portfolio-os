import { reactRouter } from '@react-router/dev/vite';
import { cloudflareDevProxy } from '@react-router/dev/vite/cloudflare';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import { getLoadContext } from './load-context';
import path from 'path';

export default defineConfig({
  plugins: [
    cloudflareDevProxy({ getLoadContext }),
    reactRouter(),
    tsconfigPaths(),
  ],
  resolve: {
    alias: {
      '~': path.resolve(__dirname, 'app'),
    },
  },
});
