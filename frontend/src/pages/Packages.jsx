import { useState, useEffect } from 'react';
import api from '../api/axios';
import { motion } from 'framer-motion';
import { FaGem, FaArrowRight, FaCheckCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Packages = () => {
  const [packages, setPackages] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data } = await api.get('services');
        const filtered = data.filter(s => 
            s.name.toLowerCase().includes('package') || 
            s.name.toLowerCase().includes('combo') ||
            s.name.toLowerCase().includes('ritual')
        );
        setPackages(filtered);
      } catch (error) {
        console.error(error);
      }
    };
    fetchServices();
  }, []);

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 bg-gray-50 dark:bg-dark-950">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h3 className="text-gold-600 uppercase tracking-[0.3em] text-xs font-bold mb-4 flex items-center justify-center gap-2">
            <FaGem /> Exclusive Collections
          </h3>
          <h1 className="font-display text-5xl md:text-7xl text-gray-900 dark:text-white mb-6">Signature <span className="italic text-gray-500">Rituals</span></h1>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg font-light">Experience the pinnacle of gentleman's grooming. Our signature rituals combine multiple treatments into a seamless journey of rejuvenation.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {packages.map((pkg, idx) => (
            <motion.div 
              key={pkg.id}
              initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="bg-white dark:bg-dark-900 rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col lg:flex-row border border-gray-100 dark:border-white/5"
            >
              <div className="lg:w-2/5 h-64 lg:h-auto relative">
                <img 
                  src={pkg.image} 
                  alt={pkg.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?q=80&w=1888&auto=format&fit=crop";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"></div>
              </div>
              
              <div className="p-10 lg:w-3/5 flex flex-col justify-between">
                <div>
                    <div className="flex justify-between items-start mb-4">
                        <h3 className="text-3xl font-serif text-gray-900 dark:text-white">{pkg.name}</h3>
                        <span className="text-2xl font-display text-gold-600 font-bold">${pkg.price}</span>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mb-8 leading-relaxed italic">
                        "{pkg.description}"
                    </p>
                    
                    <div className="space-y-3 mb-10">
                        <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                            <FaCheckCircle className="text-gold-500" />
                            <span>Complete transformation package</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                            <FaCheckCircle className="text-gold-500" />
                            <span>Complimentary beverage & cigar service</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                            <FaCheckCircle className="text-gold-500" />
                            <span>Estimated duration: {pkg.duration} mins</span>
                        </div>
                    </div>
                </div>

                <button 
                  onClick={() => navigate('/dashboard', { state: { preSelectedServiceId: pkg.id } })}
                  className="w-full py-4 rounded-2xl bg-gray-900 dark:bg-white text-white dark:text-black font-bold uppercase tracking-widest hover:bg-gold-500 hover:text-black transition-all flex items-center justify-center gap-3"
                >
                  Book Ritual <FaArrowRight className="text-xs" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {packages.length === 0 && (
            <div className="text-center py-20 text-gray-400 italic border-2 border-dashed border-gray-200 dark:border-white/10 rounded-3xl">
                New seasonal rituals coming soon. Check back shortly.
            </div>
        )}
      </div>
    </div>
  );
};

export default Packages;