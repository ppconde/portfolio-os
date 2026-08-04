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
    className={({ isActive }) =>
      `px-4 py-2 font-perfect-dos-vga-win underline transition-colors duration-200 ${
        isActive && !disableItem
          ? 'text-accent-dark'
          : 'text-accent-light hover:no-underline'
      }`
    }
    onClick={toggleMenu}
    prefetch="intent"
    to={to}
  >
    {children}
  </NavLink>
);
