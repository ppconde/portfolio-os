import { useLocation } from 'react-router';
import { NavItem } from './NavItem';

const LINKS = ['About', 'Experience', 'Projects', 'Contact'];

export default function NavList({
  className,
  toggleMenu,
}: {
  className?: string;
  toggleMenu?: () => void;
}) {
  const { pathname } = useLocation();

  return (
    <nav className={className}>
      {pathname !== '/home' && pathname !== '/home/' && (
        <NavItem to="/home" toggleMenu={toggleMenu}>
          [Home]
        </NavItem>
      )}
      {LINKS.map((to) => (
        <NavItem key={to} to={`/${to.toLowerCase()}`} toggleMenu={toggleMenu}>
          [{to}]
        </NavItem>
      ))}
    </nav>
  );
}
