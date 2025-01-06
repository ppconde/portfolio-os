import { Outlet } from 'react-router';
import { useState } from 'react';
import NavList from '~/components/NavList';
import HamburgerButton from '~/components/website/HamburgerButton';

export default function Website() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = (toggle: boolean = !isMenuOpen) => {
    setIsMenuOpen(toggle);
  };

  return (
    <div className="@container flex h-full flex-col bg-white">
      <div className="relative flex h-full flex-row">
        <HamburgerButton
          className="@xl:hidden absolute right-0 flex bg-white"
          isOpen={isMenuOpen}
          onClick={() => toggleMenu()}
        />
        <NavList
          className={`@xl:border-r @xl:flex flex-col space-y-1 overflow-hidden border-gray-200 bg-white p-2 ${
            isMenuOpen
              ? 'transition-max-height flex max-h-full p-6 duration-500 ease-in-out'
              : '@xl:max-w-full @xl:max-h-full transition-max-height max-h-0 max-w-0 duration-500 ease-in-out'
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
