import classNames from 'classnames';
import { useState } from 'react';
import { Outlet } from 'react-router';
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
          className="absolute right-0 flex @xl:hidden bg-white"
          isOpen={isMenuOpen}
          onClick={() => toggleMenu()}
        />
        <NavList
          className={classNames(
            '@xl:flex flex-col space-y-1 overflow-hidden border-gray-200 @xl:border-r-2 bg-white p-2',
            {
              'flex max-h-full p-6 transition-max-height duration-500 ease-in-out':
                isMenuOpen,
              '@xl:max-h-full max-h-0 @xl:max-w-full max-w-0 transition-max-height duration-500 ease-in-out':
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
