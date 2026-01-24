import { useContext, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
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
                  {/* Only show Dashboard link for all logged in users, but we could customize label */}
                  <Link to="/dashboard" className="text-sm font-medium text-gold-600 dark:text-gold-400 hover:text-black dark:hover:text-white transition-colors">
                    {user.role === 'customer' ? 'MY BOOKINGS' : 'DASHBOARD'}
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

      {/* Mobile Side Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsOpen(false)}
                className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm"
            />

            {/* Side Drawer */}
            <motion.div 
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="fixed top-0 left-0 bottom-0 w-[85%] max-w-sm bg-white dark:bg-dark-950 z-50 md:hidden shadow-2xl border-r border-gray-200 dark:border-white/10 flex flex-col"
            >
                {/* Drawer Header */}
                <div className="p-6 border-b border-gray-100 dark:border-white/5 flex justify-between items-center bg-gray-50/50 dark:bg-white/5">
                    <div className="font-display text-2xl font-bold tracking-widest text-gray-900 dark:text-white flex items-center gap-2">
                        <span className="text-3xl text-gold-500">✦</span>
                        LUXE
                    </div>
                    <button onClick={() => setIsOpen(false)} className="p-2 text-gray-500 hover:text-red-500 transition-colors">
                        <FaTimes size={24} />
                    </button>
                </div>

                {/* Drawer Links */}
                <div className="flex-1 overflow-y-auto py-6 px-6 space-y-6">
                    {/* Navigation Links */}
                    <div className="space-y-2">
                        {['Home', 'Services', 'About'].map((item) => (
                        <Link 
                            key={item} 
                            to={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                            onClick={() => setIsOpen(false)}
                            className="block text-2xl font-display text-gray-800 dark:text-gray-100 hover:text-gold-600 dark:hover:text-gold-500 transition-colors py-2"
                        >
                            {item}
                        </Link>
                        ))}
                    </div>
                </div>

                {/* Drawer Footer (Actions) */}
                <div className="p-6 border-t border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/5">
                    {user ? (
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-full bg-gold-500/20 flex items-center justify-center text-gold-600">
                                    <span className="font-bold text-lg">{user.name.charAt(0).toUpperCase()}</span>
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900 dark:text-white">Hello, {user.name.split(' ')[0]}</p>
                                    <p className="text-xs text-gray-500 uppercase">{user.role}</p>
                                </div>
                            </div>
                            
                            {/* Role-based conditional buttons */}
                            {user.role === 'customer' ? (
                                <Link 
                                    to="/dashboard" 
                                    onClick={() => setIsOpen(false)}
                                    className="block w-full text-center bg-gray-900 dark:bg-white text-white dark:text-black py-3 rounded-xl font-bold uppercase tracking-widest hover:bg-gold-500 dark:hover:bg-gold-400 transition-all shadow-lg text-sm"
                                >
                                    Go to Dashboard
                                </Link>
                            ) : (
                                <Link 
                                    to="/dashboard" 
                                    onClick={() => setIsOpen(false)}
                                    className="block w-full text-center border border-gray-900/20 dark:border-white/20 text-gray-900 dark:text-white py-3 rounded-xl font-bold uppercase tracking-widest hover:bg-gray-100 dark:hover:bg-white/5 transition-all text-sm"
                                >
                                    Admin/Staff Panel
                                </Link>
                            )}
                            
                            <button 
                                onClick={handleLogout}
                                className="w-full py-3 text-red-500 font-bold uppercase tracking-widest text-xs hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-4">
                            <Link to="/login" onClick={() => setIsOpen(false)}>
                                <button className="w-full py-3 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-bold uppercase tracking-wider hover:bg-gray-100 dark:hover:bg-white/10 transition-colors text-xs">
                                    Login
                                </button>
                            </Link>
                            <Link to="/register" onClick={() => setIsOpen(false)}>
                                <button className="w-full py-3 rounded-xl bg-gold-500 text-black font-bold uppercase tracking-wider hover:bg-gold-400 transition-colors shadow-lg text-xs">
                                    Sign Up
                                </button>
                            </Link>
                        </div>
                    )}
                </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;