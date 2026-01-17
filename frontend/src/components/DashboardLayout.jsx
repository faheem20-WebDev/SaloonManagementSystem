import Sidebar from './Sidebar';
import { motion } from 'framer-motion';
import { FaBars } from 'react-icons/fa';
import { useState } from 'react';

const DashboardLayout = ({ title, items, activeItem, onItemClick, children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900 flex text-gray-900 dark:text-white font-sans selection:bg-gold-500 selection:text-black transition-colors duration-500">
      
      {/* Unified Sidebar (Handles Desktop & Mobile Drawer) */}
      <Sidebar 
        title={title} 
        items={items} 
        activeItem={activeItem} 
        onItemClick={onItemClick}
        mobileOpen={mobileMenuOpen}
        setMobileOpen={setMobileMenuOpen}
      />

      {/* Mobile Header (Only visible on small screens to trigger sidebar) */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-20 z-30 bg-white/80 dark:bg-dark-950/80 backdrop-blur-xl border-b border-gray-200 dark:border-white/10 px-6 flex justify-between items-center transition-colors duration-500">
         {/* Title or Logo */}
         <div className="flex items-center gap-2">
            <span className="font-display text-2xl text-gold-600 dark:text-gold-500 font-bold tracking-widest">LUXE</span>
         </div>
         
         {/* Hamburger Button */}
         <button 
           onClick={() => setMobileMenuOpen(true)} 
           className="p-2 -mr-2 text-gray-900 dark:text-white hover:text-gold-500 dark:hover:text-gold-400 transition-colors"
         >
            <FaBars size={24} />
         </button>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 overflow-x-hidden pt-24 md:pt-0 w-full relative">
        <div className="p-6 md:p-12 max-w-7xl mx-auto min-h-screen">
          
          {/* Dashboard Title (Desktop only, mobile has header) */}
          <div className="hidden md:block mb-8">
             {/* We can add breadcrumbs or top bar here if needed later */}
          </div>

          <motion.div
            key={activeItem}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="h-full"
          >
            {children}
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;