import { Outlet } from 'react-router';
import { useState } from 'react';
import NavList from '~/components/NavList';
import HamburgerButton from '~/components/website/HamburgerButton';

export default function WebsiteLayout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = (toggle: boolean = !isMenuOpen) => {
    setIsMenuOpen(toggle);
  };

  return (
    <div className="flex h-full flex-col bg-white @container">
      <div className="relative flex h-full flex-row">
        <HamburgerButton
          className="absolute right-0 flex bg-white @xl:hidden"
          isOpen={isMenuOpen}
          onClick={() => toggleMenu()}
        />
        <NavList
          className={`flex-col space-y-1 overflow-hidden border-gray-200 bg-white p-2 @xl:flex @xl:border-r ${
            isMenuOpen
              ? 'flex max-h-full p-6 transition-max-height duration-500 ease-in-out'
              : 'max-h-0 max-w-0 transition-max-height duration-500 ease-in-out @xl:max-h-full @xl:max-w-full'
          } `}
          toggleMenu={() => toggleMenu(false)}
        />

        {/* Main Content Area */}
        <main
          className={`no-scrollbar ${isMenuOpen ? 'hidden' : 'flex-1'} overflow-y-scroll p-6`}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}
