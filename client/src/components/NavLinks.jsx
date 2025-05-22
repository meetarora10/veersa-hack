import { motion } from 'framer-motion';
import { Link as ScrollLink } from 'react-scroll';
import { NavLink } from 'react-router-dom';

const navItems = [
  { to: "home", label: "Home", type: "scroll" },
  { to: "about", label: "About", type: "scroll" },
  { to: "doctor", label: "Doctors", type: "scroll" },
  { to: "contact", label: "Contact", type: "scroll" },
  { to: "/register", label: "Register", type: "route" },
  { to: "/login", label: "Login", type: "route" }
];

const NavLinks = ({ navmod, isMobile, onClick }) => {
  return navItems.map(({ to, label, type }) => (
    <li key={label} className="my-1">
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        {type === "scroll" ? (
          <ScrollLink
            to={to}
            smooth={true}
            duration={500}
            offset={to === "home" ? -1 : -80}
            spy={true}
            activeClass="active-scroll"
            onClick={onClick}
            className={`
              ${isMobile ? "block w-full text-center" : "inline-block"}
              border border-blue-500
              px-5 py-2 rounded-full font-semibold transition-all duration-300 cursor-pointer
              text-blue-800/80 bg-white shadow-md
              hover:bg-blue-100 hover:text-blue-900/80
            `}
          >
            {label}
          </ScrollLink>
        ) : (
          <NavLink
            to={to}
            onClick={onClick}
            className={({ isActive }) => `
              ${isMobile ? "block w-full text-center" : "inline-block"}
              px-5 py-2 rounded-lg font-semibold transition-all duration-300
              flex items-center justify-center border-2 border-solid border-white
              ${isActive
                ? "bg-orange-500 text-white shadow-lg"
                : "bg-orange-400 text-white shadow-md hover:bg-orange-500 hover:shadow-[5px_5px_0px_0px_rgb(255,255,255)"}
            `}
          >
            {label}
          </NavLink>
        )}
      </motion.div>

      {/* Active Scroll Styling */}
      <style>
        {`
          .active-scroll {
            background-color: #2563eb !important;
            color: white !important;
            box-shadow: 0 0 12px rgba(37, 99, 235, 0.4) !important;
          }
        `}
      </style>
    </li>
  ));
};

export default NavLinks;
