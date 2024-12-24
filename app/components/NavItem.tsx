import { NavLink } from "react-router";

export const NavItem = ({ to, children }: { to: string; children: React.ReactNode }) => (
    <NavLink
        to={to}
        className={({ isActive }) =>
            `px-4 py-2 transition-colors duration-200 ${isActive
                ? 'bg-gray-200 text-gray-800'
                : 'text-gray-600 hover:bg-gray-100'
            }`
        }
    >
        {children}
    </NavLink>
);