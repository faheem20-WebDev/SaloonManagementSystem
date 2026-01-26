import { useState, useEffect, useContext } from 'react';
import api from '../api/axios';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FaArrowRight, FaGem, FaCheckCircle, FaCut, FaChessKing, FaClock } from 'react-icons/fa';

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

  // Filter services that are "Packages"
  const packages = services.filter(s => 
    s.name.toLowerCase().includes('package') || 
    s.name.toLowerCase().includes('combo') ||
    s.name.toLowerCase().includes('ritual')
  ).slice(0, 3); // Just top 3 for landing page

  // Normal Services
  const individualServices = services.filter(s => 
    !s.name.toLowerCase().includes('package') && 
    !s.name.toLowerCase().includes('combo')
  ).slice(0, 4);

  return (
    <div className="min-h-screen text-gray-900 dark:text-white selection:bg-gold-500 selection:text-black font-sans">
      
      {/* 1. HERO SECTION - EXCLUSIVE MEN'S SALON */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-white dark:to-dark-950 z-10"></div>
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1503951914875-452162b0f3f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80')] bg-cover bg-center scale-105"></div>
        </div>

        <div className="relative z-20 text-center px-4">
           <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }} className="mb-4">
             <span className="text-gold-500 uppercase tracking-[0.5em] text-xs font-bold bg-black/40 px-6 py-2 rounded-full backdrop-blur-md">The Modern Gentleman's Club</span>
           </motion.div>
           
           <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 1 }}>
             <h1 className="font-display text-7xl md:text-[10vw] leading-none mb-6 text-white drop-shadow-2xl">LUXE <span className="text-gold-500 italic">BARBER</span></h1>
             <p className="font-serif text-xl md:text-3xl text-gray-200 mb-10 max-w-3xl mx-auto italic">Refining Masculine Excellence through Masterful Grooming.</p>
              
              <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
                 <Link to={user ? "/dashboard" : "/register"} className="btn-gold group flex items-center gap-3 px-10 py-5">
                    {user ? "BOOK A CHAIR" : "JOIN THE CLUB"} 
                    <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                 </Link>
                 <Link to="/services" className="px-10 py-5 border-2 border-white/30 text-white rounded-full font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all">Explore Menu</Link>
              </div>
           </motion.div>
        </div>

        <motion.div style={{ y: y1 }} className="absolute top-20 right-[10%] w-64 h-64 bg-gold-600/10 rounded-full blur-[80px] z-10"></motion.div>
      </section>

      {/* 2. MARQUEE */}
      <div className="py-8 bg-black border-y border-gold-500/30 overflow-hidden">
        <div className="whitespace-nowrap animate-marquee flex items-center gap-16">
          {[1,2,3,4].map((i) => (
             <span key={i} className="text-3xl md:text-5xl font-display font-bold text-gold-500 uppercase opacity-80 italic">
               Master Barbers • Hot Towel Shaves • Beard Sculpting • Premium Pomades •
             </span>
          ))}
        </div>
      </div>

      {/* 3. SIGNATURE RITUALS (PACKAGES) */}
      {packages.length > 0 && (
          <section className="py-32 bg-white dark:bg-black/40 relative overflow-hidden">
              <div className="max-w-7xl mx-auto px-6">
                  <div className="flex flex-col md:flex-row justify-between items-center mb-20 gap-6">
                      <div className="text-center md:text-left">
                          <h3 className="text-gold-600 uppercase tracking-widest text-xs font-bold mb-2 flex items-center gap-2">
                              <FaChessKing /> Exclusive Bundles
                          </h3>
                          <h2 className="font-display text-5xl md:text-7xl text-gray-900 dark:text-white">Luxe <span className="italic text-gray-500">Rituals</span></h2>
                      </div>
                      <Link to="/packages" className="btn-outline border-gold-500 text-gold-600 dark:text-gold-400">View All Packages</Link>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                      {packages.map((pkg, idx) => (
                          <motion.div key={pkg.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} className="group relative bg-gray-50 dark:bg-dark-900 rounded-[2.5rem] p-2 overflow-hidden border border-gray-100 dark:border-white/5" >
                              <div className="h-80 w-full overflow-hidden rounded-[2rem] relative">
                                  <img 
                                    src={pkg.image} 
                                    alt={pkg.name} 
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                                    onError={(e) => {
                                        e.target.src = "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=2074&auto=format&fit=crop";
                                    }}
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80"></div>
                                  <div className="absolute bottom-6 left-6">
                                      <span className="bg-gold-500 text-black px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg">${pkg.price}</span>
                                  </div>
                              </div>
                              <div className="p-8">
                                  <h4 className="text-2xl font-serif text-gray-900 dark:text-white mb-4">{pkg.name}</h4>
                                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-8 leading-relaxed line-clamp-2 italic">"{pkg.description}"</p>
                                  <button onClick={() => handlePackageBooking(pkg.id)} className="w-full py-4 rounded-2xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white font-bold uppercase tracking-widest hover:bg-gold-500 hover:text-black hover:border-gold-500 transition-all flex items-center justify-center gap-2 group/btn" >
                                    BOOK RITUAL <FaArrowRight className="text-xs group-hover/btn:translate-x-1 transition-transform" />
                                  </button>
                              </div>
                          </motion.div>
                      ))}
                  </div>
              </div>
          </section>
      )}

      {/* 4. INDIVIDUAL SERVICES SECTION */}
      <section className="py-32 px-6 bg-gray-50 dark:bg-dark-950">
        <div className="max-w-7xl mx-auto">
            <div className="text-center mb-24">
                <h3 className="text-gold-600 uppercase tracking-[0.3em] text-xs font-bold mb-4">Precision Grooming</h3>
                <h2 className="font-display text-5xl md:text-7xl text-gray-900 dark:text-white">Our <span className="italic text-gray-500">Specialties</span></h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                {individualServices.map((service, idx) => (
                    <motion.div key={service.id} initial={{ opacity: 0, x: idx % 2 === 0 ? -30 : 30 }} whileInView={{ opacity: 1, x: 0 }} className="flex flex-col md:flex-row gap-8 items-center" >
                        <div className="w-full md:w-48 h-48 shrink-0 rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white dark:border-white/5">
                            <img 
                                src={service.image} 
                                alt={service.name} 
                                className="w-full h-full object-cover" 
                                onError={(e) => {
                                    e.target.src = "https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=2070&auto=format&fit=crop";
                                }}
                            />
                        </div>
                        <div className="flex-1 space-y-4">
                            <div className="flex justify-between items-end border-b border-gray-200 dark:border-white/10 pb-2">
                                <h4 className="text-2xl font-serif text-gray-900 dark:text-white">{service.name}</h4>
                                <span className="text-gold-600 dark:text-gold-400 font-bold font-display text-xl">${service.price}</span>
                            </div>
                            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{service.description}</p>
                            <div className="flex gap-6 items-center text-[10px] uppercase tracking-widest font-bold text-gray-400">
                                <span className="flex items-center gap-2"><FaClock className="text-gold-500" /> {service.duration} MIN</span>
                                <Link to="/dashboard" state={{ preSelectedServiceId: service.id }} className="text-gold-600 hover:underline">Quick Book</Link>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
            
            <div className="mt-24 text-center">
                <Link to="/services" className="px-12 py-5 bg-black text-white dark:bg-white dark:text-black rounded-full font-bold uppercase tracking-[0.2em] text-xs hover:bg-gold-500 hover:text-black transition-all shadow-2xl">Discover Full Menu</Link>
            </div>
        </div>
      </section>

      {/* 5. EDITORIAL ABOUT */}
      <section className="py-32 bg-white dark:bg-dark-900 border-t border-gray-100 dark:border-white/5">
         <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center gap-24">
            <div className="w-full lg:w-1/2 relative">
               <img src="https://images.unsplash.com/photo-1512690118330-2c783197ff6a?q=80&w=1740&auto=format&fit=crop" alt="Men's Salon Interior" className="rounded-[3rem] shadow-[0_50px_100px_rgba(0,0,0,0.2)] dark:shadow-[0_50px_100px_rgba(0,0,0,0.5)] grayscale hover:grayscale-0 transition-all duration-1000" />
               <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-gold-500 rounded-[2rem] flex items-center justify-center p-8 text-black text-center shadow-2xl">
                   <p className="font-display font-bold leading-tight uppercase text-lg italic">The Highest Standard</p>
               </div>
            </div>
            <div className="w-full lg:w-1/2 space-y-10">
               <h2 className="font-display text-6xl md:text-8xl text-gray-900 dark:text-white leading-tight uppercase">
                  Legacy <br/> <span className="italic text-gold-600 dark:text-gold-500">Meets</span> <br/> Modern
               </h2>
               <p className="text-gray-600 dark:text-gray-400 text-xl leading-relaxed font-light italic">
                  "A man's character is often reflected in his grooming. At Luxe Barber, we don't just cut hair; we sculpt confidence and honor the traditions of classic barbering with a modern architectural approach."
               </p>
               <div className="flex gap-16 pt-10 border-t border-gray-200 dark:border-white/10">
                  <div>
                     <span className="block text-5xl font-display text-gray-900 dark:text-white mb-2 italic">15+</span>
                     <span className="text-[10px] uppercase tracking-[0.3em] text-gold-600 font-bold">Years of Mastery</span>
                  </div>
                  <div>
                     <span className="block text-5xl font-display text-gray-900 dark:text-white mb-2 italic">10k+</span>
                     <span className="text-[10px] uppercase tracking-[0.3em] text-gold-600 font-bold">Confined Cuts</span>
                  </div>
               </div>
            </div>
         </div>
      </section>

    </div>
  );
};

export default Home;