import { NavLink } from 'react-router';

export const NavItem = ({
  to,
  children,
  disableIsActive = false,
}: {
  to: string;
  children: React.ReactNode;
  disableIsActive?: boolean;
}) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `text-window-super-blue px-4 py-2 font-perfect-dos-vga-win underline transition-colors duration-200 ${
        isActive && !disableIsActive
          ? 'text-windows-purple'
          : 'text-window-super-blue hover:no-underline'
      }`
    }
  >
    {children}
  </NavLink>
);
