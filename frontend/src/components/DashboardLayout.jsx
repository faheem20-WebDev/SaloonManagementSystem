import Sidebar from './Sidebar';
import { motion } from 'framer-motion';
import { FaBars } from 'react-icons/fa';
import { useState } from 'react';

const DashboardLayout = ({ title, items, activeItem, onItemClick, children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900 flex text-gray-900 dark:text-white font-sans selection:bg-gold-500 selection:text-black transition-colors duration-500">
      
      {/* Desktop Sidebar */}
      <Sidebar 
        title={title} 
        items={items} 
        activeItem={activeItem} 
        onItemClick={onItemClick} 
      />

      {/* Mobile Header - Z-index adjusted to be below Navbar if Navbar is present, or we might need to hide Navbar on dashboard */}
      {/* Assuming Navbar handles navigation, this header might be redundant or conflicting. 
          For now, adapting colors. Use z-30 to stay below Navbar (z-50) if it exists. 
      */}
      <div className="md:hidden fixed top-20 w-full z-30 bg-white/90 dark:bg-dark-950/90 backdrop-blur border-b border-gray-200 dark:border-white/10 p-4 flex justify-between items-center transition-colors duration-500">
         <span className="font-display text-xl text-gold-600 dark:text-gold-500">{title}</span>
         <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-gray-900 dark:text-white">
            <FaBars size={24} />
         </button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-white dark:bg-dark-900 md:hidden p-6 animate-fade-in pt-32">
           <div className="flex justify-between items-center mb-8">
              <span className="font-display text-2xl text-gold-600 dark:text-gold-500">{title}</span>
              <button onClick={() => setMobileMenuOpen(false)} className="text-gray-900 dark:text-white">Close</button>
           </div>
           <div className="space-y-4">
              {items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => { onItemClick(item.id); setMobileMenuOpen(false); }}
                  className={`w-full text-left px-4 py-3 rounded-lg ${activeItem === item.id ? 'bg-gold-500 text-black font-bold' : 'text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-white/5'}`}
                >
                  {item.label}
                </button>
              ))}
           </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden pt-10 md:pt-0">
        <div className="p-6 md:p-12 max-w-7xl mx-auto">
          <motion.div
            key={activeItem}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {children}
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;