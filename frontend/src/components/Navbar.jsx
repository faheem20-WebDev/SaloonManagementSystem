import { useContext, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import ThemeContext from '../context/ThemeContext';
import { FaBars, FaTimes, FaSun, FaMoon } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Hide Navbar completely if on dashboard routes to prevent double headers
  if (location.pathname.startsWith('/dashboard')) {
      return null; 
  }

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  return (
    <>
      <nav
        className={`sticky top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${
          scrolled 
            ? 'py-4 bg-white/80 dark:bg-dark-950/80 backdrop-blur-xl border-b border-gray-200 dark:border-white/5 shadow-sm dark:shadow-none' 
            : 'py-6 bg-white dark:bg-dark-950 border-b border-gray-100 dark:border-white/5'
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-6 flex justify-between items-center">
          
          {/* Logo */}
          <Link to="/" className="relative z-50 group">
             <div className="font-display text-3xl font-bold tracking-widest text-gray-900 dark:text-white flex items-center gap-2 transition-colors duration-300">
                <span className="text-4xl text-gold-500 transform group-hover:rotate-12 transition-transform duration-500">✦</span>
                LUXE
             </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-12">
            {['Home', 'Services', 'About'].map((item) => (
              <Link 
                key={item} 
                to={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                className="text-sm uppercase tracking-[0.2em] text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors relative group font-medium"
              >
                {item}
                <span className="absolute -bottom-2 left-0 w-0 h-[1px] bg-gold-500 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </div>

          {/* Right Side */}
          <div className="hidden md:flex items-center gap-6">
            <button 
                onClick={toggleTheme} 
                className="p-2 rounded-full text-gray-600 dark:text-gray-400 hover:text-gold-500 dark:hover:text-gold-400 transition-colors"
                aria-label="Toggle Theme"
            >
                {theme === 'dark' ? <FaSun size={20} /> : <FaMoon size={20} />}
            </button>

            {user ? (
               <div className="flex items-center gap-4">
                  <Link to="/dashboard" className="text-sm font-medium text-gold-600 dark:text-gold-400 hover:text-black dark:hover:text-white transition-colors">
                    DASHBOARD
                  </Link>
                  <button 
                    onClick={handleLogout} 
                    className="border border-gray-900/20 dark:border-white/20 px-6 py-2 rounded-full text-xs uppercase tracking-widest text-gray-900 dark:text-white hover:bg-gray-900 hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-300"
                  >
                    Logout
                  </button>
               </div>
            ) : (
               <div className="flex items-center gap-6">
                 <Link to="/login" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors">LOGIN</Link>
                 <Link to="/register">
                    <button className="bg-gray-900 dark:bg-white text-white dark:text-black px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-gold-500 dark:hover:bg-gold-400 transition-all duration-300 transform hover:scale-105 shadow-lg dark:shadow-none">
                       Book Now
                    </button>
                 </Link>
               </div>
            )}
          </div>

          {/* Mobile Toggle */}
          <div className="md:hidden z-50 flex items-center gap-4">
            <button 
                onClick={toggleTheme} 
                className="text-gray-900 dark:text-white p-2"
            >
                {theme === 'dark' ? <FaSun size={20} /> : <FaMoon size={20} />}
            </button>
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-900 dark:text-white p-2">
              {isOpen ? <FaTimes size={24} /> : <div className="space-y-1.5 group">
                <span className="block w-8 h-[1px] bg-gray-900 dark:bg-white transition-all group-hover:w-6"></span>
                <span className="block w-6 h-[1px] bg-gray-900 dark:bg-white transition-all group-hover:w-8"></span>
                <span className="block w-4 h-[1px] bg-gray-900 dark:bg-white transition-all group-hover:w-6"></span>
              </div>}
            </button>
          </div>
        </div>
      </nav>

      {/* Full Screen Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: '-100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '-100%' }}
            transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 bg-white dark:bg-dark-950 z-40 flex items-center justify-center"
          >
            <div className="text-center space-y-8">
               {['Home', 'Services', 'Dashboard', 'Login'].map((item) => (
                 <div key={item} className="overflow-hidden">
                   <motion.div 
                      initial={{ y: 100 }} 
                      animate={{ y: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                   >
                     <Link 
                        to={item === 'Home' ? '/' : `/${item.toLowerCase()}`} 
                        onClick={() => setIsOpen(false)}
                        className="block font-display text-5xl text-gray-900 dark:text-white hover:text-gold-500 transition-colors"
                     >
                        {item}
                     </Link>
                   </motion.div>
                 </div>
               ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;