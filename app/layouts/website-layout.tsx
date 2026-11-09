import classNames from 'classnames';
import { useState } from 'react';
import { Outlet } from 'react-router';
import NavList from '~/components/OS/NavList';
import HamburgerButton from '~/components/website/HamburgerButton';

export default function WebsiteLayout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="@container flex h-full flex-col bg-white">
      <div className="relative flex h-full flex-row">
        <HamburgerButton
          className="absolute right-0 flex bg-white @xl:hidden"
          isOpen={isMenuOpen}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        />
        <NavList
          className={classNames(
            'flex-col space-y-1 overflow-hidden border-gray-200 bg-white @xl:flex @xl:border-r-2',
            {
              'transition-max-height flex max-h-full p-6 duration-500 ease-in-out':
                isMenuOpen,
              // Collapsed: no padding (it leaked a sliver of link text) and invisible (out of tab order).
              'transition-max-height invisible max-h-0 max-w-0 p-0 duration-500 ease-in-out @xl:visible @xl:max-h-full @xl:max-w-full @xl:p-2':
                !isMenuOpen,
            }
          )}
          toggleMenu={() => setIsMenuOpen(false)}
        />

        {/* Main Content Area */}
        <main
          className={classNames('scrollbar-windows overflow-y-auto p-6', {
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
