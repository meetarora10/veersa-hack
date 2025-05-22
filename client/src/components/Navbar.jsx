import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import NavLinks from './NavLinks';
const Navbar = () => {
    // state to manage scroll of navbar
    const [navmod, setNavmod] = useState(false);
    // state for responsiveness of navbar
    const [isNavOpen, setIsNavOpen] = useState(false);

    useEffect(() => {
        const handleBack = () => {
            if (window.scrollY >= 112) {
                setNavmod(true);
            } else {
                setNavmod(false);
            }
        };

        window.addEventListener('scroll', handleBack);
        return () => window.removeEventListener('scroll', handleBack);
    }, []);

    const handleClick = () => {
        setIsNavOpen(!isNavOpen);
    };

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isNavOpen && !event.target.closest('.navbar-container')) {
                setIsNavOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isNavOpen]);

    return (
        <>
            <div className={`fixed w-full z-50 transition-all duration-500 navbar-container ${navmod
                    ? 'bg-black/40 backdrop-blur-sm'
                    : 'bg-transparent backdrop-blur-none'
                }`}>
                <div className="flex justify-evenly items-center px-6 md:px-16 lg:px-24 py-4">
                    {/* Desktop Navigation */}
                    <nav className="hidden md:block">
                        <ul className="flex items-center space-x-8 justify-evenly w-full">
                            <NavLinks navmod={navmod} isMobile={false} />
                            <div className='flex items-center pl-30 lg:order-2'>
                                <Link
                                    to="#"
                                    className='bg-blue-800 hover:bg-blue-300 text-white px-4 py-2 rounded-full font-semibold transform scale-105 shadow-md transition-all duration-300'
                                    spy={true}
                                    smooth={true}
                                    offset={50}
                                    duration={500}
                                >
                                    Login
                                </Link>
                                <Link
                                    to="#"
                                    className='bg-orange-800 hover:bg-orange-300 text-white px-4 py-2 rounded-full font-semibold transform scale-105 shadow-md transition-all duration-300'
                                    spy={true}
                                    smooth={true}
                                    offset={50}
                                    duration={500}
                                >
                                    Register
                                </Link>
                            </div>
                        </ul>
                    </nav>

                    {/* Hamburger Menu Button */}
                    <button
                        className="md:hidden flex flex-col justify-center items-center w-10 h-10 rounded-lg hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 z-50 transition-all duration-300"
                        onClick={handleClick}
                        aria-label="Toggle menu"
                    >
                        <span className={`block w-6 h-0.5 transition-all duration-300 ease-in-out ${navmod ? 'bg-gray-700' : 'bg-white'
                            } ${isNavOpen ? 'transform rotate-45 translate-y-1.5' : 'mb-1.5'}`}></span>
                        <span className={`block w-6 h-0.5 transition-all duration-300 ease-in-out ${navmod ? 'bg-gray-700' : 'bg-white'
                            } ${isNavOpen ? 'opacity-0' : 'mb-1.5'}`}></span>
                        <span className={`block w-6 h-0.5 transition-all duration-300 ease-in-out ${navmod ? 'bg-gray-700' : 'bg-white'
                            } ${isNavOpen ? 'transform -rotate-45 -translate-y-1.5' : ''}`}></span>
                    </button>
                </div>

                {/* Mobile Navigation Menu */}
                <div
                    className="md:hidden transition-all duration-300 overflow-hidden"
                >
                    <ul className="flex flex-col py-4 px-6 space-y-2">
                        <NavLinks navmod={navmod} isMobile={true} onClick={() => setIsNavOpen(false)} />
                        <div className='flex items-center lg:order-2'>
                            <Link
                                to="#"
                                className='bg-blue-600 text-white px-4 py-2 rounded-full font-semibold transform scale-105 shadow-md transition-all duration-300'
                                spy={true}
                                smooth={true}
                                offset={50}
                                duration={500}
                            >
                                Login
                            </Link>
                            <Link
                                to="#"
                                className='bg-orange-800 hover:bg-orange-300 text-white px-4 py-2 rounded-full font-semibold transform scale-105 shadow-md transition-all duration-300'
                                spy={true}
                                smooth={true}
                                offset={50}
                                duration={500}
                            >
                                Register
                            </Link>
                        </div>
                    </ul>
                </div>
            </div>
        </>
    );
};

export default Navbar;