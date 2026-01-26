import { useState, useEffect } from 'react';
import api from '../api/axios';
import { motion } from 'framer-motion';
import { FaCut, FaArrowRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Services = () => {
  const [services, setServices] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data } = await api.get('services');
        // Filter out packages for this page if needed, but usually services page shows everything
        setServices(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchServices();
  }, []);

  return (
    <div className="min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h3 className="text-gold-600 uppercase tracking-widest text-sm mb-4">Masterful Grooming</h3>
          <h1 className="font-display text-5xl md:text-7xl text-gray-900 dark:text-white mb-6">Our <span className="italic text-gray-500">Services</span></h1>
          <p className="text-gray-500 max-w-2xl mx-auto">From precision haircuts to traditional hot towel shaves, discover our range of premium grooming services designed exclusively for the modern gentleman.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {services.map((service, idx) => (
            <motion.div 
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="glass-panel rounded-3xl overflow-hidden group border border-gray-100 dark:border-white/5"
            >
              <div className="h-64 overflow-hidden relative">
                <img 
                  src={service.image || "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80"} 
                  alt={service.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors"></div>
                <div className="absolute top-4 right-4 bg-white/90 dark:bg-dark-900/90 backdrop-blur-md px-4 py-2 rounded-full font-bold text-gold-600 shadow-lg">
                  ${service.price}
                </div>
              </div>
              
              <div className="p-8">
                <h3 className="text-2xl font-serif text-gray-900 dark:text-white mb-3">{service.name}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 leading-relaxed line-clamp-3">
                  {service.description}
                </p>
                
                <div className="flex justify-between items-center pt-6 border-t border-gray-100 dark:border-white/5">
                  <span className="text-xs uppercase tracking-widest text-gray-400 font-bold">{service.duration} Minutes</span>
                  <button 
                    onClick={() => navigate('/dashboard', { state: { preSelectedServiceId: service.id } })}
                    className="text-gold-600 dark:text-gold-400 font-bold text-sm flex items-center gap-2 group/btn"
                  >
                    BOOK NOW <FaArrowRight className="text-xs group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Services;