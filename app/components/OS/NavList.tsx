import { useLocation } from 'react-router';
import { NavItem } from './NavItem';

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
        <NavItem to="/home" disableItem toggleMenu={toggleMenu}>
          [Home]
        </NavItem>
      )}
      <NavItem to="/about" toggleMenu={toggleMenu}>
        [About]
      </NavItem>
      <NavItem to="/experience" toggleMenu={toggleMenu}>
        [Experience]
      </NavItem>
      <NavItem to="/projects" toggleMenu={toggleMenu}>
        [Projects]
      </NavItem>
      <NavItem to="/contact" toggleMenu={toggleMenu}>
        [Contact]
      </NavItem>
    </nav>
  );
}
