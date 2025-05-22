// NavLinks.js
import { NavLink } from "react-router-dom";

const navItems = [
  { to: "home", label: "Home" },
  { to: "about", label: "About" },
  { to: "contact", label: "Contact" },
  { to: "doctor", label: "Doctors" },
];

const NavLinks = ({ navmod, isMobile, onClick }) => {
  return navItems.map(({ to, label }) => (
    <li key={to} className={`flex-1 text-center text-black`}>
      <NavLink
        to={to}
        className={({ isActive }) =>
          navmod
            ? isActive
              ? `${isMobile ? "block" : ""} bg-blue-600 px-4 py-2 rounded-full font-semibold shadow-md transition-all duration-300`
              : `${isMobile ? "block" : ""} text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-full transition-all duration-300 font-medium`
            : isActive
            ? `${isMobile ? "block" : ""} bg-white text-blue-600 px-4 py-2 rounded-full font-semibold shadow-lg transition-all duration-300`
            : `${isMobile ? "block" : ""} hover:text-blue-200 hover:bg-white/20 px-4 py-2 rounded-full transition-all duration-300 font-medium`
        }
        onClick={onClick}
      >
        {label}
      </NavLink>
    </li>
  ));
};


export default NavLinks;
