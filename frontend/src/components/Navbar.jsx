import { useState, useEffect } from 'react';
import { Link as ScrollLink, Events, scrollSpy, animateScroll as scroll } from 'react-scroll';
import { motion } from 'framer-motion';
import { Link, NavLink, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [user, setUser] = useState(localStorage.getItem('username') || null);

  const navigate = useNavigate();
  // Update user state when localStorage changes
  useEffect(() => {
    const handleStorageChange = () => {
      setUser(localStorage.getItem('username') || null);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    const handleSetActive = (to) => {
      setActiveSection(to);
    };

    Events.scrollEvent.register('begin', handleSetActive);
    Events.scrollEvent.register('end', handleSetActive);

    scrollSpy.update();

    return () => {
      Events.scrollEvent.remove('begin');
      Events.scrollEvent.remove('end');
    };
  }, []);

  const navItems = [
    { name: 'Home', to: 'home' },
    { name: 'About', to: 'about' },
    { name: 'Contact', to: 'contact' },
  ];

  const renderNavItem = (item, isMobile = false) => (
    <ScrollLink
      key={item.to}
      to={item.to}
      spy={true}
      smooth={true}
      offset={-70}
      duration={500}
      className={`${
        isMobile ? 'block' : ''
      } px-3 py-2 rounded-md text-sm font-medium cursor-pointer transition-colors duration-200`}
      activeClass="bg-indigo-700 text-white"
    >
      {item.name}
    </ScrollLink>
  );

  return (
    <nav className="bg-indigo-600 fixed w-full z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-white text-2xl font-bold">EduQuiz</span>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {navItems.map((item) => renderNavItem(item))}
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            
              {user ? (
                <div className="flex items-center gap-2">
                  <p className="bg-white text-indigo-600 px-4 py-2 rounded-md text-sm font-medium">
                    Welcome {user}
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-red-500 text-white px-4 py-2 rounded-md text-sm font-medium"
                    onClick={() => {
                        localStorage.removeItem('token');
                        localStorage.removeItem('username');
                        localStorage.removeItem('role');
                      setUser(null);
                      navigate('/');
                    }}
                  >
                    Logout
                  </motion.button>
                </div>
              ) : (
                <a href='/verify' className="ml-4 flex items-center md:ml-6">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white text-indigo-600 px-4 py-2 rounded-md text-sm font-medium"
                >
                  Sign Up / Sign In
                </motion.button>
                </a>
              )}
            
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="bg-indigo-600 inline-flex items-center justify-center p-2 rounded-md text-white hover:text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-600 focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {!isOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => renderNavItem(item, true))}
          </div>
          <div className="pt-4 pb-3 border-t border-indigo-500">
            <div className="flex items-center px-5">
              <Link to="/verify">
                {user ? (
                  <div className="flex flex-col gap-2">
                    <p className="bg-white text-indigo-600 px-4 py-2 rounded-md text-sm font-medium">
                      Welcome {user}
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-red-500 text-white px-4 py-2 rounded-md text-sm font-medium"
                      onClick={() => {
                        localStorage.removeItem('token');
                        localStorage.removeItem('username');
                        setUser(null);
                        navigate('/');
                      }}
                    >
                      Logout
                    </motion.button>
                  </div>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-white text-indigo-600 px-4 py-2 rounded-md text-sm font-medium"
                  >
                    Sign Up / Sign In
                  </motion.button>
                )}
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
