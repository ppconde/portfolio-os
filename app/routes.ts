import {
  type RouteConfig,
  index,
  layout,
  route,
} from '@react-router/dev/routes';

export default [
  index('routes/index.tsx'),
  route('/home', 'routes/website/home.tsx'),
  layout('layouts/website-layout.tsx', [
    route('about', 'routes/website/about.tsx'),
    route('experience', 'routes/website/experience.tsx'),
    route('projects', 'routes/website/projects.tsx'),
    route('contact', 'routes/website/contact.tsx'),
  ]),
] satisfies RouteConfig;
