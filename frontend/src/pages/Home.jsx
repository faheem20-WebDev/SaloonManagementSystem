import { useState, useEffect, useContext } from 'react';
import api from '../api/axios';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FaArrowRight, FaStar, FaGem, FaCheckCircle, FaSparkles } from 'react-icons/fa';

const Home = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
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

  const handlePackageBooking = (serviceId) => {
      if (!user) {
          navigate('/register', { state: { fromPackage: true, serviceId } });
      } else {
          navigate('/dashboard', { state: { preSelectedServiceId: serviceId } });
      }
  };

  // Filter services that are "Packages" (naming convention)
  const packages = services.filter(s => 
    s.name.toLowerCase().includes('package') || 
    s.name.toLowerCase().includes('combo') ||
    s.name.toLowerCase().includes('ritual')
  );

  return (
    <div className="min-h-screen text-gray-900 dark:text-white selection:bg-gold-500 selection:text-black">
      
      {/* 1. Ultra Modern Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-white/30 dark:from-dark-950/30 via-transparent to-white dark:to-dark-950 z-10"></div>
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-60 dark:opacity-60 scale-105 animate-slow-pan"></div>
        </div>

        <div className="relative z-20 text-center px-4">
           <motion.div initial={{ opacity: 0, y: 100 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: "easeOut" }} className="overflow-hidden">
             <h1 className="font-display text-[15vw] leading-none text-transparent bg-clip-text bg-gradient-to-b from-gray-900 to-gray-500 dark:from-white dark:to-gray-500 opacity-90 mix-blend-overlay dark:mix-blend-overlay">LUXE</h1>
           </motion.div>
           
           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 1 }}>
              <h2 className="font-serif text-3xl md:text-5xl font-light text-gray-900 dark:text-white -mt-4 md:-mt-10 mb-8 italic">
                The Art of <span className="text-gold-600 dark:text-gold-400">Elegance</span>
              </h2>
              
              <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
                 {(!user || user.role === 'customer') && (
                    <Link to={user ? "/dashboard" : "/register"} className="btn-gold group flex items-center gap-3 shadow-lg dark:shadow-[0_0_20px_rgba(212,175,55,0.4)]">
                        {user ? "Book Now" : "Book Appointment"} 
                        <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                 )}
                 {user && (user.role === 'admin' || user.role === 'worker') && (
                    <Link to="/dashboard" className="btn-gold px-10 py-4 font-bold uppercase tracking-widest">Go to Portal</Link>
                 )}
                 <Link to="/services" className="text-sm uppercase tracking-widest border-b border-transparent hover:border-gold-500 pb-1 transition-all text-gray-900 dark:text-white font-medium">Discover Services</Link>
              </div>
           </motion.div>
        </div>

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

      {/* 3. SIGNATURE COLLECTIONS (PACKAGES) - NEW SECTION */}
      {packages.length > 0 && (
          <section className="py-32 bg-gray-50 dark:bg-black/20 relative overflow-hidden">
              <div className="max-w-7xl mx-auto px-6">
                  <div className="text-center mb-20">
                      <h3 className="text-gold-600 uppercase tracking-[0.3em] text-xs font-bold mb-4 flex items-center justify-center gap-2">
                          <FaGem /> Exclusive
                      </h3>
                      <h2 className="font-display text-5xl md:text-7xl text-gray-900 dark:text-white">
                          Luxe <span className="italic text-gray-500">Collections</span>
                      </h2>
                      <p className="text-gray-500 mt-6 max-w-xl mx-auto">Elevate your experience with our curated rituals, combining our most sought-after treatments into singular journeys of transformation.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                      {packages.map((pkg, idx) => (
                          <motion.div 
                            key={pkg.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-white dark:bg-dark-900 rounded-[2rem] p-10 border border-gray-100 dark:border-white/5 shadow-2xl relative group overflow-hidden"
                          >
                              <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/5 rounded-full -mr-16 -mt-16 group-hover:bg-gold-500/10 transition-all duration-500"></div>
                              
                              <div className="mb-8">
                                  <h4 className="text-2xl font-serif text-gray-900 dark:text-white mb-2">{pkg.name}</h4>
                                  <div className="flex items-baseline gap-1">
                                      <span className="text-4xl font-display text-gold-600 font-bold">${pkg.price}</span>
                                      <span className="text-gray-400 text-sm italic">full experience</span>
                                  </div>
                              </div>

                              <div className="space-y-4 mb-10 text-sm text-gray-500 dark:text-gray-400">
                                  <div className="flex items-center gap-3">
                                      <FaCheckCircle className="text-gold-500 shrink-0" />
                                      <span>Exclusive master stylist assignment</span>
                                  </div>
                                  <div className="flex items-center gap-3">
                                      <FaCheckCircle className="text-gold-500 shrink-0" />
                                      <span>Approximately {pkg.duration} minutes</span>
                                  </div>
                                  <div className="flex items-center gap-3">
                                      <FaCheckCircle className="text-gold-500 shrink-0" />
                                      <span>Complimentary luxury beverage</span>
                                  </div>
                              </div>

                              <button 
                                onClick={() => handlePackageBooking(pkg.id)}
                                className="w-full py-4 rounded-2xl border-2 border-gold-500 text-gold-600 dark:text-gold-400 font-bold uppercase tracking-widest hover:bg-gold-500 hover:text-black transition-all flex items-center justify-center gap-2 group"
                              >
                                Reserve Ritual <FaArrowRight className="text-xs group-hover:translate-x-1 transition-transform" />
                              </button>
                          </motion.div>
                      ))}
                  </div>
              </div>
          </section>
      )}

      {/* 4. Services - Masonry/Grid Style */}
      <section className="py-32 px-6 md:px-12 max-w-[1600px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20">
           <div>
             <h3 className="text-gold-600 dark:text-gold-500 uppercase tracking-widest text-sm mb-4">Our Menu</h3>
             <h2 className="font-display text-5xl md:text-7xl text-gray-900 dark:text-white leading-tight">
               Curated <br/> <span className="italic text-gray-500">Experiences</span>
             </h2>
           </div>
           <Link to="/services" className="hidden md:block px-8 py-4 border border-gray-900/20 dark:border-white/20 rounded-full hover:bg-gray-900 hover:text-white dark:hover:bg-white dark:hover:text-black transition-all font-medium uppercase tracking-widest text-xs">
             View Full Menu
           </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
           {services.filter(s => !s.name.toLowerCase().includes('package')).slice(0, 4).map((service, idx) => (
             <motion.div 
               key={service.id}
               initial={{ opacity: 0, y: 50 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: idx * 0.1 }}
               className={`relative group ${idx === 0 ? 'md:col-span-8 md:row-span-2 h-[600px]' : idx === 1 ? 'md:col-span-4 h-[300px]' : 'md:col-span-4 h-[300px]'}`}
             >
                <div className="absolute inset-0 bg-gray-200 dark:bg-gray-800 overflow-hidden rounded-3xl shadow-xl border border-gray-100 dark:border-white/5">
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

      {/* 5. Editorial "About" Section */}
      <section className="py-24 bg-white dark:bg-dark-900 border-t border-gray-100 dark:border-white/5 transition-colors duration-500">
         <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-16">
            <div className="w-full md:w-1/2 relative group">
               <div className="absolute -inset-4 bg-gold-500/10 rounded-full blur-3xl group-hover:bg-gold-500/20 transition-all"></div>
               <img src="https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80" alt="Interior" className="relative rounded-3xl shadow-2xl grayscale hover:grayscale-0 transition-all duration-700" />
            </div>
            <div className="w-full md:w-1/2 space-y-8">
               <h2 className="font-display text-5xl md:text-6xl text-gray-900 dark:text-white leading-tight">
                  Beauty is not just <br/>
                  <span className="italic text-gold-600 dark:text-gold-500">Visual</span>
               </h2>
               <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed font-light">
                  At Luxe, we believe in a holistic approach to styling. It is not merely about the cut or the color, but the feeling of transformation. Our master stylists are artists dedicated to revealing your most authentic self.
               </p>
               <div className="flex gap-12 pt-8 border-t border-gray-200 dark:border-white/10">
                  <div>
                     <span className="block text-4xl font-display text-gray-900 dark:text-white mb-1">15+</span>
                     <span className="text-xs uppercase tracking-widest text-gray-500 font-bold">Years Mastery</span>
                  </div>
                  <div>
                     <span className="block text-4xl font-display text-gray-900 dark:text-white mb-1">5k+</span>
                     <span className="text-xs uppercase tracking-widest text-gray-500 font-bold">Transformations</span>
                  </div>
               </div>
            </div>
         </div>
      </section>

    </div>
  );
};

export default Home;