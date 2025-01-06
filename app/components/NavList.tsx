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
      {pathname !== '/website' && (
        <NavItem to="/website" disableIsActive toggleMenu={toggleMenu}>
          [Home]
        </NavItem>
      )}
      <NavItem to="/website/about" toggleMenu={toggleMenu}>
        [About]
      </NavItem>
      <NavItem to="/website/experience" toggleMenu={toggleMenu}>
        [Experience]
      </NavItem>
      <NavItem to="/website/projects" toggleMenu={toggleMenu}>
        [Projects]
      </NavItem>
      <NavItem to="/website/contact" toggleMenu={toggleMenu}>
        [Contact]
      </NavItem>
    </nav>
  );
}
