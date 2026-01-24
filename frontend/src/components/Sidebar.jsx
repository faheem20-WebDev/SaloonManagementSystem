import { motion, AnimatePresence } from 'framer-motion';
import { FaSignOutAlt, FaHome, FaTimes, FaUserCircle } from 'react-icons/fa';
import { useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Sidebar = ({ title, items, activeItem, onItemClick, mobileOpen, setMobileOpen }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Content for the Sidebar (Shared between Mobile and Desktop)
  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* 1. Header: User Info */}
      <div className="p-8 border-b border-gray-200 dark:border-white/5 bg-gray-50/50 dark:bg-white/5">
         <div className="flex items-center gap-4 mb-4">
             <div className="w-12 h-12 rounded-full bg-gold-500/20 flex items-center justify-center text-gold-600 dark:text-gold-400">
                 <FaUserCircle size={28} />
             </div>
             <div>
                 <p className="font-bold text-gray-900 dark:text-white leading-tight">{user?.name || 'Guest'}</p>
                 <p className="text-xs text-gray-500 uppercase tracking-wider">{user?.role || 'Visitor'}</p>
             </div>
         </div>
         <h2 className="font-display text-xl text-gold-600 dark:text-gold-500 tracking-widest">{title}</h2>
      </div>

      {/* 2. Navigation Items */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => {
                onItemClick(item.id);
                if(setMobileOpen) setMobileOpen(false); // Close drawer on click
            }}
            className={`w-full text-left px-6 py-4 rounded-xl transition-all duration-300 flex items-center gap-4 relative group ${
              activeItem === item.id 
                ? 'bg-gold-500/10 text-gold-600 dark:text-gold-400 border border-gold-500/20 shadow-[0_0_15px_rgba(212,175,55,0.1)]' 
                : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5'
            }`}
          >
            <item.icon className={`transition-colors ${activeItem === item.id ? 'text-gold-600 dark:text-gold-500' : 'text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white'}`} />
            <span className="font-medium tracking-wide">{item.label}</span>
            {activeItem === item.id && (
              <motion.div 
                layoutId="sidebar-active"
                className="absolute left-0 w-1 h-8 bg-gold-600 dark:bg-gold-500 rounded-r-full"
              />
            )}
          </button>
        ))}

        {/* Separator */}
        <div className="my-4 border-t border-gray-200 dark:border-white/5 mx-4"></div>

        {/* Back to Home Link */}
        <Link 
            to="/" 
            className="w-full text-left px-6 py-4 rounded-xl transition-all duration-300 flex items-center gap-4 text-gray-500 hover:text-black dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5"
        >
            <FaHome className="text-gray-400" />
            <span className="font-medium tracking-wide">Back to Home</span>
        </Link>
      </nav>

      {/* 3. Footer: Logout */}
      <div className="p-4 border-t border-gray-200 dark:border-white/5 bg-gray-50/50 dark:bg-white/5">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-4 px-6 py-4 text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors"
        >
          <FaSignOutAlt />
          <span className="tracking-wide font-medium">Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (Static) */}
      <div className="hidden md:block w-80 bg-white dark:bg-dark-950 border-r border-gray-200 dark:border-white/5 h-screen sticky top-0 transition-colors duration-500">
         <SidebarContent />
      </div>

      {/* Mobile Drawer (Animated) */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm"
            />
            
            {/* Drawer */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 left-0 bottom-0 w-[85%] max-w-sm bg-white dark:bg-dark-900 z-50 md:hidden shadow-2xl border-r border-gray-200 dark:border-white/10"
            >
               {/* Close Button Mobile */}
               <button 
                 onClick={() => setMobileOpen(false)}
                 className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white z-50"
               >
                 <FaTimes size={20} />
               </button>

               <SidebarContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;