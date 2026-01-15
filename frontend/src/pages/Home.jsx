import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FaArrowRight, FaStar } from 'react-icons/fa';

const Home = () => {
  const [services, setServices] = useState([]);
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const y2 = useTransform(scrollY, [0, 500], [0, -100]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data } = await api.get('services');
        setServices(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchServices();
  }, []);

  return (
    <div className="min-h-screen text-gray-900 dark:text-white selection:bg-gold-500 selection:text-black">
      
      {/* 1. Ultra Modern Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Video/Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-white/30 dark:from-dark-950/30 via-transparent to-white dark:to-dark-950 z-10"></div>
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-60 dark:opacity-60 scale-105 animate-slow-pan"></div>
        </div>

        <div className="relative z-20 text-center px-4">
           <motion.div 
             initial={{ opacity: 0, y: 100 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 1, ease: "easeOut" }}
             className="overflow-hidden"
           >
             <h1 className="font-display text-[15vw] leading-none text-transparent bg-clip-text bg-gradient-to-b from-gray-900 to-gray-500 dark:from-white dark:to-gray-500 opacity-90 mix-blend-overlay dark:mix-blend-overlay">
               LUXE
             </h1>
           </motion.div>
           
           <motion.div
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ delay: 0.5, duration: 1 }}
           >
              <h2 className="font-serif text-3xl md:text-5xl font-light text-gray-900 dark:text-white -mt-4 md:-mt-10 mb-8 italic">
                The Art of <span className="text-gold-600 dark:text-gold-400">Elegance</span>
              </h2>
              
              <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
                 <Link to="/register" className="btn-gold group flex items-center gap-3 shadow-lg dark:shadow-[0_0_20px_rgba(212,175,55,0.4)]">
                    Book Appointment 
                    <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                 </Link>
                 <Link to="/services" className="text-sm uppercase tracking-widest border-b border-transparent hover:border-gold-500 pb-1 transition-all text-gray-900 dark:text-white">
                    Discover Services
                 </Link>
              </div>
           </motion.div>
        </div>

        {/* Floating Abstract Elements */}
        <motion.div style={{ y: y1 }} className="absolute top-20 right-[10%] w-64 h-64 bg-gold-600/10 rounded-full blur-[80px] z-10"></motion.div>
        <motion.div style={{ y: y2 }} className="absolute bottom-20 left-[10%] w-96 h-96 bg-purple-900/10 rounded-full blur-[100px] z-10"></motion.div>
      </section>

      {/* 2. Marquee Section */}
      <div className="py-10 bg-gold-500 overflow-hidden -skew-y-2 transform origin-left">
        <div className="whitespace-nowrap animate-marquee flex items-center gap-16">
          {[1,2,3,4,5,6].map((i) => (
             <span key={i} className="text-4xl md:text-6xl font-display font-bold text-black uppercase">
               Premium Styling • Luxury Care • Expert Artists •
             </span>
          ))}
        </div>
      </div>

      {/* 3. Services - Masonry/Grid Style */}
      <section className="py-32 px-6 md:px-12 max-w-[1600px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20">
           <div>
             <h3 className="text-gold-600 dark:text-gold-500 uppercase tracking-widest text-sm mb-4">Our Menu</h3>
             <h2 className="font-display text-5xl md:text-7xl text-gray-900 dark:text-white leading-tight">
               Curated <br/> <span className="italic text-gray-500">Experiences</span>
             </h2>
           </div>
           <Link to="/services" className="hidden md:block px-8 py-4 border border-gray-900/20 dark:border-white/20 rounded-full hover:bg-gray-900 hover:text-white dark:hover:bg-white dark:hover:text-black transition-all">
             View Full Menu
           </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
           {services.slice(0, 4).map((service, idx) => (
             <motion.div 
               key={service._id}
               initial={{ opacity: 0, y: 50 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: idx * 0.1 }}
               className={`relative group ${
                 idx === 0 ? 'md:col-span-8 md:row-span-2 h-[600px]' : 
                 idx === 1 ? 'md:col-span-4 h-[300px]' : 
                 'md:col-span-4 h-[300px] md:-mt-[0px]'
               }`}
             >
                <div className="absolute inset-0 bg-gray-200 dark:bg-gray-800 overflow-hidden rounded-2xl shadow-xl">
                   <img 
                      src={service.image || "https://images.unsplash.com/photo-1562322140-8baeececf3df?ixlib=rb-4.0.3&auto=format&fit=crop&w=1769&q=80"} 
                      alt={service.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 dark:opacity-80 group-hover:opacity-100"
                   />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                </div>
                
                <div className="absolute bottom-0 left-0 p-8 w-full">
                   <div className="flex justify-between items-end">
                      <div>
                        <h3 className="text-3xl font-serif text-white mb-2">{service.name}</h3>
                        <p className="text-gray-300 text-sm max-w-xs line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform translate-y-4 group-hover:translate-y-0">{service.description}</p>
                      </div>
                      <span className="text-2xl font-display text-gold-400 italic">${service.price}</span>
                   </div>
                </div>
             </motion.div>
           ))}
        </div>
      </section>

      {/* 4. Editorial "About" Section */}
      <section className="py-24 bg-white dark:bg-dark-900 border-t border-gray-100 dark:border-white/5 transition-colors duration-500">
         <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-16">
            <div className="w-full md:w-1/2">
               <img src="https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80" alt="Interior" className="rounded-none shadow-2xl grayscale hover:grayscale-0 transition-all duration-700" />
            </div>
            <div className="w-full md:w-1/2 space-y-8">
               <h2 className="font-display text-5xl md:text-6xl text-gray-900 dark:text-white">
                  Beauty is not just <br/>
                  <span className="italic text-gold-600 dark:text-gold-500">Visual</span>
               </h2>
               <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed font-light">
                  At Luxe, we believe in a holistic approach to styling. It is not merely about the cut or the color, but the feeling of transformation. Our master stylists are artists dedicated to revealing your most authentic self.
               </p>
               <div className="flex gap-12 pt-8 border-t border-gray-200 dark:border-white/10">
                  <div>
                     <span className="block text-4xl font-display text-gray-900 dark:text-white mb-1">15+</span>
                     <span className="text-xs uppercase tracking-widest text-gray-500">Years Mastery</span>
                  </div>
                  <div>
                     <span className="block text-4xl font-display text-gray-900 dark:text-white mb-1">5k+</span>
                     <span className="text-xs uppercase tracking-widest text-gray-500">Transformations</span>
                  </div>
               </div>
            </div>
         </div>
      </section>

    </div>
  );
};

export default Home;