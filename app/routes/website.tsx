import React from 'react';
import { useOutletContext, NavLink, Outlet } from 'react-router';
import { DesktopWindow } from '~/contexts/WindowsContext';
import { NavItem } from '~/components/NavItem';


export default function Website() {
  const { title } = useOutletContext<DesktopWindow>();

  return (
    <div className="flex h-full flex-col bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white p-4">
        <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
      </header>

      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white">
        <div className="flex space-x-1 p-2">
          <NavItem to="/website">Home</NavItem>
          <NavItem to="/website/about">About</NavItem>
          <NavItem to="/website/experience">Experience</NavItem>
          <NavItem to="/website/education">Education</NavItem>
          <NavItem to="/website/contact">Contact</NavItem>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 overflow-auto p-6">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white p-4 text-center text-sm text-gray-600">
        © {new Date().getFullYear()} Portfolio. All rights reserved.
      </footer>
    </div>
  );
}
