import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
    layout("layouts/windows.tsx", [
        index('routes/index.tsx'),
        route("website", 'routes/website/website.tsx', [
            route("about", 'routes/website/about.tsx'),
            route("experience", 'routes/website/experience.tsx'),
            route("projects", 'routes/website/projects.tsx'),
            route("contact", 'routes/website/contact.tsx'),
        ]),
    ])
    // pattern ^           ^ module file
] satisfies RouteConfig;
