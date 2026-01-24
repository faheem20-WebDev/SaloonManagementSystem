import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCookieBite, FaTimes } from 'react-icons/fa';

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already accepted
    const consent = localStorage.getItem('luxe_cookie_consent');
    if (!consent) {
      // Small delay before showing the banner for better UX
      const timer = setTimeout(() => setIsVisible(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('luxe_cookie_consent', 'true');
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-6 left-6 right-6 md:left-auto md:right-8 md:max-w-md z-[9999]"
        >
          <div className="bg-white dark:bg-dark-800 rounded-3xl shadow-2xl border border-gold-500/20 p-6 relative overflow-hidden group">
            {/* Background Accent */}
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-gold-500/5 rounded-full blur-2xl group-hover:bg-gold-500/10 transition-colors"></div>
            
            <div className="flex gap-4 items-start relative z-10">
              <div className="w-12 h-12 bg-gold-500/10 rounded-2xl flex items-center justify-center text-gold-600 shrink-0">
                <FaCookieBite size={24} />
              </div>
              
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Cookie Policy</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-4">
                  We use cookies to enhance your luxury styling experience. By continuing, you agree to our 
                  <span className="text-gold-600 font-medium cursor-pointer hover:underline ml-1">Privacy Policy</span>.
                </p>
                
                <div className="flex gap-3">
                  <button 
                    onClick={handleAccept}
                    className="flex-1 bg-gold-500 hover:bg-gold-600 text-black font-bold py-2.5 rounded-xl transition-all shadow-lg shadow-gold-500/20 active:scale-95"
                  >
                    Accept All
                  </button>
                  <button 
                    onClick={() => setIsVisible(false)}
                    className="px-4 py-2.5 border border-gray-200 dark:border-white/10 text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 rounded-xl transition-colors text-sm"
                  >
                    Decline
                  </button>
                </div>
              </div>

              <button 
                onClick={() => setIsVisible(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors"
              >
                <FaTimes />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsent;