import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import NavLinks from './NavLinks';

const Navbar = () => {
    const [navmod, setNavmod] = useState(false);
    const [isNavOpen, setIsNavOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setNavmod(window.scrollY >= 64);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setIsNavOpen(false);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isNavOpen && !event.target.closest('.navbar-container')) {
                setIsNavOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isNavOpen]);

    const handleClick = () => setIsNavOpen((prev) => !prev);

    return (
        <>
            <div className="fixed w-full z-50 flex justify-center items-center top-0 left-0 pointer-events-none ">
                <div
                    className={`navbar-container pointer-events-auto transition-all duration-500 
                        ${navmod
                            ? 'bg-white/70 backdrop-blur-2xl border border-blue-500'
                            : 'bg-white/50 backdrop-blur-xl border border-white/20'
                        }
                        flex items-center justify-between
                        px-4 md:px-8 py-2 mt-4
                        max-w-4xl w-[90%]
                        rounded-full shadow-[0_8px_32px_rgba(31,38,135,0.18)] z-50
                        
                    `}
                >
                    
                    <button
                        className="md:hidden flex flex-col justify-center items-center w-10 h-10 rounded-full hover:bg-white/30 focus:outline-none transition-all duration-300 mr-2"
                        onClick={handleClick}
                        aria-label="Toggle menu"
                    >
                        <span className={`block w-6 h-0.5 transition-all ${isNavOpen ? 'rotate-45 translate-y-1.5' : 'mb-1.5'} ${navmod ? 'bg-blue-800' : 'bg-blue-700'}`} />
                        <span className={`block w-6 h-0.5 transition-all ${isNavOpen ? 'opacity-0' : 'mb-1.5'} ${navmod ? 'bg-blue-800' : 'bg-blue-700'}`} />
                        <span className={`block w-6 h-0.5 transition-all ${isNavOpen ? '-rotate-45 -translate-y-1.5' : ''} ${navmod ? 'bg-blue-800' : 'bg-blue-700'}`} />
                    </button>
                    <Link to="/" className="flex items-center text-xl md:text-2xl font-extrabold tracking-wide drop-shadow-sm select-none whitespace-nowrap mr-4">
                        <span className="text-blue-400">Tel</span>
                        <span className="italic text-teal-400/70">Hea</span>
                        <span className="text-blue-400 font-bold">lth</span>
                    </Link>
                    <nav className="hidden md:flex flex-1 justify-center">
                        <ul className="flex items-center gap-8 text-sm font-medium text-gray-700">
                            <NavLinks navmod={navmod} isMobile={false} />
                        </ul>
                    </nav>
                </div>
            </div>
            <div
                className={`fixed top-0 left-0 w-full z-40 transition-all duration-500 ease-in-out
                    ${isNavOpen ? 'opacity-100 max-h-screen py-8' : 'opacity-0 max-h-0 py-0'}
                    bg-white/80 backdrop-blur-xl border-b border-white/30
                    rounded-b-[2rem] overflow-hidden shadow-2xl
                `}
            >
                <ul className="flex flex-col items-center gap-6 px-8 pt-24 pb-10 text-gray-800 text-base font-semibold">
                    <NavLinks navmod={navmod} isMobile={true} onClick={() => setIsNavOpen(false)} />
                </ul>
            </div>
        </>
    );
};

export default Navbar;