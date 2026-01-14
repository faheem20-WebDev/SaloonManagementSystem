import { motion } from 'framer-motion';
import { FaSignOutAlt } from 'react-icons/fa';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Sidebar = ({ title, items, activeItem, onItemClick }) => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="w-64 bg-white dark:bg-dark-950 border-r border-gray-200 dark:border-white/5 h-screen sticky top-0 flex flex-col hidden md:flex transition-colors duration-500">
      <div className="p-8 border-b border-gray-200 dark:border-white/5">
         <h2 className="font-display text-2xl text-gold-600 dark:text-gold-500 tracking-widest">{title}</h2>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => onItemClick(item.id)}
            className={`w-full text-left px-6 py-4 rounded-xl transition-all duration-300 flex items-center gap-4 ${
              activeItem === item.id 
                ? 'bg-gold-500/10 text-gold-600 dark:text-gold-400 border border-gold-500/20 shadow-[0_0_15px_rgba(212,175,55,0.1)]' 
                : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5'
            }`}
          >
            <item.icon className={activeItem === item.id ? 'text-gold-600 dark:text-gold-500' : 'text-gray-500'} />
            <span className="font-medium tracking-wide">{item.label}</span>
            {activeItem === item.id && (
              <motion.div 
                layoutId="sidebar-active"
                className="absolute left-0 w-1 h-8 bg-gold-600 dark:bg-gold-500 rounded-r-full"
              />
            )}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-200 dark:border-white/5">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-4 px-6 py-4 text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
        >
          <FaSignOutAlt />
          <span className="tracking-wide">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;