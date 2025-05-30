import { createPagesFunctionHandler } from '@react-router/cloudflare';

import * as build from '../build/server';

import { getLoadContext } from '../load-context';

export const onRequest = createPagesFunctionHandler({
  // @ts-expect-error - the server build file is generated by \`react-router build\`
  build,
  // @ts-expect-error - the server build file is generated by \`react-router build\`
  getLoadContext,
});
