import { Outlet } from 'react-router';
import NavList from '~/components/NavList';

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
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
