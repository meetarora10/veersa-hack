import { Link as ScrollLink } from 'react-scroll';
import { NavLink } from 'react-router-dom';

const navItems = [
  { to: "home", label: "Home", type: "scroll" },
  { to: "about", label: "About", type: "scroll" },
  { to: "doctor", label: "Doctors", type: "scroll" },
  { to: "contact", label: "Contact", type: "scroll" },
  { to: "/register", label: "Register", type: "route" },
  { to: "/login", label: "Login", type: "route"}
];

const NavLinks = ({ navmod, isMobile, onClick }) => {
  return navItems.map(({ to, label, type }) => (
    <li key={label}>
      {type === "scroll" ? (
        <ScrollLink
          to={to}
          smooth={true}
          duration={500}
          offset={-70}
          className="bg-blue-600 px-4 py-2 rounded-full font-semibold shadow-md transition-all duration-300 cursor-pointer"
          onClick={onClick}
        >
          {label}
        </ScrollLink>
      ) : (
        <NavLink
          to={to}
          className='bg-orange-800 hover:bg-orange-300 text-white px-4 py-2 rounded-full font-semibold transform scale-105 shadow-md transition-all duration-300'
          onClick={onClick}
        >
          {label}
        </NavLink>
      )}
    </li>
  ));
};

export default NavLinks;
