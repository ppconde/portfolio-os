import { useLocation } from 'react-router';
import { NavItem } from './NavItem';

export default function NavList() {
  const { pathname } = useLocation();

  return (
    <>
      {pathname !== '/website' && (
        <NavItem to="/website" disableIsActive>
          [Home]
        </NavItem>
      )}
      <NavItem to="/website/about">[About]</NavItem>
      <NavItem to="/website/experience">[Experience]</NavItem>
      <NavItem to="/website/projects">[Projects]</NavItem>
      <NavItem to="/website/contact">[Contact]</NavItem>
    </>
  );
}
