import { NavLink, useLocation } from 'react-router';

const LINKS = ['About', 'Experience', 'Projects', 'Contact'];

export default function NavList({
  className,
  toggleMenu,
}: {
  className?: string;
  toggleMenu?: () => void;
}) {
  const { pathname } = useLocation();
  const onHome = pathname === '/home' || pathname === '/home/';

  return (
    <nav className={className}>
      {(onHome ? LINKS : ['Home', ...LINKS]).map((to) => (
        <NavLink
          className={({ isActive }) =>
            `px-4 py-2 font-perfect-dos-vga-win underline transition-colors duration-200 ${
              isActive
                ? 'text-accent-dark'
                : 'text-accent-light hover:no-underline'
            }`
          }
          key={to}
          onClick={toggleMenu}
          prefetch="intent"
          to={`/${to.toLowerCase()}`}
        >
          [{to}]
        </NavLink>
      ))}
    </nav>
  );
}
