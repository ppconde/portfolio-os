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
      `px-4 py-2 font-perfect-dos-vga-win text-window-super-blue underline transition-colors duration-200 ${
        isActive && !disableIsActive
          ? 'text-windows-purple'
          : 'text-window-super-blue hover:no-underline'
      }`
    }
    onClick={toggleMenu}
    viewTransition
  >
    {children}
  </NavLink>
);
