import { NavLink } from 'react-router';

export const NavItem = ({
  to,
  children,
  disableItem = false,
  toggleMenu,
}: {
  to: string;
  children: React.ReactNode;
  disableItem?: boolean;
  toggleMenu?: () => void;
}) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `font-perfect-dos-vga-win px-4 py-2 underline transition-colors duration-200 ${
        isActive && !disableItem
          ? 'text-windows-purple'
          : 'text-windows-super-blue hover:no-underline'
      }`
    }
    onClick={toggleMenu}
    prefetch="intent"
  >
    {children}
  </NavLink>
);
