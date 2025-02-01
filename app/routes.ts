import {
  type RouteConfig,
  index,
  layout,
  prefix,
  route,
} from '@react-router/dev/routes';

export default [
  index('routes/index.tsx'),
  route('/website', 'routes/website/home.tsx'),
  layout('layouts/website-layout.tsx', [
    ...prefix('/website', [
      route('about', 'routes/website/about.tsx'),
      route('experience', 'routes/website/experience.tsx'),
      route('projects', 'routes/website/projects.tsx'),
      route('contact', 'routes/website/contact.tsx'),
    ]),
  ]),
  route('/msn', 'routes/msn.tsx'),
] satisfies RouteConfig;
