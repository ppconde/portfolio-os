import { MDXProvider } from '@mdx-js/react';
import { Outlet } from 'react-router';
import NavList from '~/components/NavList';
import H2 from '~/components/website/H2';
import H3 from '~/components/website/H3';
import Section from '~/components/website/Section';

const components = {
  H2: (props: { children: React.ReactNode }) => <H2 {...props} />,
  H3: (props: { title: string; subtitle: string }) => <H3 {...props} />,
  Section: (props: { children: React.ReactNode }) => <Section {...props} />,
};

export default function Website() {
  return (
    <div className="flex h-full flex-col bg-white">
      <div className="flex h-full flex-row">
        {/* Navigation */}
        <nav className="h-full border-r border-gray-200 bg-white">
          <div className="flex flex-col space-y-1 p-2">
            <NavList />
          </div>
        </nav>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-scroll p-6">
          <MDXProvider components={components}>
            <Outlet />
          </MDXProvider>
        </main>
      </div>
    </div>
  );
}
