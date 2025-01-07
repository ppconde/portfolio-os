import { NavLink } from 'react-router';

export const NavItem = ({
  to,
  children,
  disableIsActive = false,
  toggleMenu,
}: {
  to: string;
  children: React.ReactNode;
  disableIsActive?: boolean;
  toggleMenu?: () => void;
}) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `px-4 py-2 font-perfect-dos-vga-win underline transition-colors duration-200 ${
        isActive && !disableIsActive
          ? 'text-windows-purple'
          : 'text-windows-super-blue hover:no-underline'
      }`
    }
    onClick={toggleMenu}
    viewTransition
    prefetch="intent"
  >
    {children}
  </NavLink>
);
