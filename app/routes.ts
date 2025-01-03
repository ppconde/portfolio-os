import {
  type RouteConfig,
  index,
  layout,
  prefix,
  route,
} from '@react-router/dev/routes';

export default [
  index('routes/index.tsx'),
  layout('layouts/windows.tsx', [
    ...prefix('/website', [index('routes/website/home.tsx')]),
    layout('layouts/website.tsx', [
      ...prefix('/website', [
        route('about', 'routes/website/about.mdx'),
        route('experience', 'routes/website/experience.mdx'),
        route('projects', 'routes/website/projects.mdx'),
        route('contact', 'routes/website/contact.tsx'),
      ]),
    ]),
  ]),
] satisfies RouteConfig;
