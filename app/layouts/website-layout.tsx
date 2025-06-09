import { Outlet } from 'react-router';
import { useState } from 'react';
import classNames from 'classnames';
import NavList from '~/components/OS/NavList';
import HamburgerButton from '~/components/website/HamburgerButton';

export default function WebsiteLayout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = (toggle: boolean = !isMenuOpen) => {
    setIsMenuOpen(toggle);
  };

  return (
    <div className="@container flex h-full flex-col bg-white">
      <div className="relative flex h-full flex-row">
        <HamburgerButton
          className="absolute right-0 flex bg-white @xl:hidden"
          isOpen={isMenuOpen}
          onClick={() => toggleMenu()}
        />
        <NavList
          className={classNames(
            'flex-col space-y-1 overflow-hidden border-gray-200 bg-white p-2 @xl:flex @xl:border-r-2',
            {
              'transition-max-height flex max-h-full p-6 duration-500 ease-in-out':
                isMenuOpen,
              'transition-max-height max-h-0 max-w-0 duration-500 ease-in-out @xl:max-h-full @xl:max-w-full':
                !isMenuOpen,
            }
          )}
          toggleMenu={() => toggleMenu(false)}
        />

        {/* Main Content Area */}
        <main
          className={classNames('no-scrollbar overflow-y-scroll p-6', {
            hidden: isMenuOpen,
            'flex-1': !isMenuOpen,
          })}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}
