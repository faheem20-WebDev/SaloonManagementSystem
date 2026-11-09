import { useState, useEffect, useContext } from 'react';
import api from '../api/axios';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FaArrowRight, FaGem, FaCheckCircle, FaCut, FaChessKing, FaClock, FaUsers, FaCog } from 'react-icons/fa';

const Home = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [services, setServices] = useState([]);
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const y2 = useTransform(scrollY, [0, 500], [0, -100]);

  useEffect(() => {
    if (location.pathname === '/about' || location.hash === '#about') {
      const element = document.getElementById('about');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location]);

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
          return;
      } 
      
      if (user.role !== 'customer') {
          toast.info('Admins and Workers cannot book appointments.');
          return;
      }

      navigate('/dashboard', { state: { preSelectedServiceId: serviceId } });
  };

  const handleQuickBook = (serviceId) => {
      if (!user) {
          navigate('/login');
          return;
      }

      if (user.role !== 'customer') {
          toast.info('Only customers can book appointments.');
          return;
      }

      navigate('/dashboard', { state: { preSelectedServiceId: serviceId } });
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
                                <button onClick={() => handleQuickBook(service.id)} className="text-gold-600 hover:underline">Quick Book</button>
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

      {/* 5. ABOUT LUXE SALON */}
      <section id="about" className="py-32 bg-white dark:bg-dark-900 border-t border-gray-100 dark:border-white/5 transition-colors duration-500">
         <div className="max-w-7xl mx-auto px-6 space-y-24">
            
            {/* Beauty Meets Innovation Hero */}
            <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
               <div className="w-full lg:w-1/2 relative">
                  <img 
                    src="https://images.unsplash.com/photo-1512690118330-2c783197ff6a?q=80&w=1740&auto=format&fit=crop" 
                    alt="Luxe Salon Interior" 
                    className="rounded-[3rem] shadow-[0_50px_100px_rgba(0,0,0,0.2)] dark:shadow-[0_50px_100px_rgba(0,0,0,0.5)] grayscale hover:grayscale-0 transition-all duration-1000 w-full object-cover" 
                  />
                  <div className="absolute -bottom-8 -right-8 md:-bottom-10 md:-right-10 w-44 h-44 md:w-52 md:h-52 bg-gold-500 rounded-[2rem] flex items-center justify-center p-6 text-black text-center shadow-2xl">
                      <p className="font-display font-bold leading-tight uppercase text-base md:text-lg italic">
                        Where Beauty Meets Innovation
                      </p>
                  </div>
               </div>
               
               <div className="w-full lg:w-1/2 space-y-8">
                  <div>
                     <h3 className="text-gold-600 dark:text-gold-500 uppercase tracking-[0.3em] text-xs font-bold mb-4 flex items-center gap-2">
                        <FaGem className="text-gold-500" /> About Luxe Salon
                     </h3>
                     <h2 className="font-display text-5xl md:text-7xl lg:text-8xl text-gray-900 dark:text-white leading-tight uppercase">
                        Beauty <br/> <span className="italic text-gold-600 dark:text-gold-500">Meets</span> <br/> Innovation
                     </h2>
                  </div>

                  <p className="text-gray-700 dark:text-gray-300 text-xl leading-relaxed font-light italic border-l-2 border-gold-500 pl-4">
                     "At Luxe Salon, we believe that beauty is more than just appearance — it's about confidence, comfort, and self-expression."
                  </p>

                  <div className="space-y-4 text-gray-600 dark:text-gray-400 text-base md:text-lg leading-relaxed font-light">
                     <p>
                        We are dedicated to providing professional beauty and grooming services in a welcoming and relaxing environment. By combining skilled professionals, quality services, and modern salon management technology, we aim to make every visit a smooth and memorable experience.
                     </p>
                     <p>
                        Our goal is to bring together exceptional salon services and smart technology to redefine the modern salon experience.
                     </p>
                  </div>
               </div>
            </div>

            {/* Mission & Vision */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-gray-200 dark:border-white/10">
               <div className="bg-gray-50 dark:bg-dark-950/60 p-8 md:p-10 rounded-[2.5rem] border border-gray-100 dark:border-white/5 space-y-4 shadow-sm">
                  <div className="w-12 h-12 rounded-2xl bg-gold-500/10 text-gold-600 dark:text-gold-400 flex items-center justify-center text-xl">
                     <FaCut />
                  </div>
                  <h3 className="font-display text-3xl md:text-4xl text-gray-900 dark:text-white uppercase">
                     Our <span className="italic text-gold-600 dark:text-gold-500">Mission</span>
                  </h3>
                  <div className="space-y-3 text-gray-600 dark:text-gray-400 text-sm md:text-base leading-relaxed font-light">
                     <p>
                        Our mission is to deliver high-quality beauty and grooming services while making every customer's experience convenient, comfortable, and personalized.
                     </p>
                     <p>
                        We also aim to simplify salon operations through modern technology, helping our team manage appointments, services, and staff more efficiently.
                     </p>
                  </div>
               </div>

               <div className="bg-gray-50 dark:bg-dark-950/60 p-8 md:p-10 rounded-[2.5rem] border border-gray-100 dark:border-white/5 space-y-4 shadow-sm">
                  <div className="w-12 h-12 rounded-2xl bg-gold-500/10 text-gold-600 dark:text-gold-400 flex items-center justify-center text-xl">
                     <FaGem />
                  </div>
                  <h3 className="font-display text-3xl md:text-4xl text-gray-900 dark:text-white uppercase">
                     Our <span className="italic text-gold-600 dark:text-gold-500">Vision</span>
                  </h3>
                  <div className="space-y-3 text-gray-600 dark:text-gray-400 text-sm md:text-base leading-relaxed font-light">
                     <p>
                        Our vision is to create a modern salon experience where professional beauty services and innovative technology work together.
                     </p>
                     <p>
                        We strive to build a trusted salon brand that values customer satisfaction, service quality, operational efficiency, and continuous improvement.
                     </p>
                  </div>
               </div>
            </div>

            {/* What Makes Luxe Salon Different */}
            <div className="pt-8">
               <div className="text-center max-w-3xl mx-auto mb-16">
                  <h3 className="text-gold-600 dark:text-gold-500 uppercase tracking-[0.3em] text-xs font-bold mb-3">
                     Distinctive Excellence
                  </h3>
                  <h2 className="font-display text-4xl md:text-6xl text-gray-900 dark:text-white uppercase">
                     What Makes <span className="italic text-gold-600 dark:text-gold-500">Luxe Salon</span> Different?
                  </h2>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {/* 1. Professional Beauty Services */}
                  <div className="bg-gray-50 dark:bg-dark-950/60 p-8 rounded-[2.5rem] border border-gray-100 dark:border-white/5 hover:border-gold-500/40 transition-all duration-300 group">
                     <div className="w-12 h-12 rounded-2xl bg-gold-500/10 text-gold-600 dark:text-gold-400 flex items-center justify-center mb-6 text-xl group-hover:scale-110 transition-transform">
                        <FaCut />
                     </div>
                     <h3 className="font-serif text-2xl text-gray-900 dark:text-white mb-3">
                        Professional Beauty Services
                     </h3>
                     <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed font-light">
                        We focus on delivering quality beauty and grooming services through dedicated salon professionals.
                     </p>
                  </div>

                  {/* 2. Personalized Customer Experience */}
                  <div className="bg-gray-50 dark:bg-dark-950/60 p-8 rounded-[2.5rem] border border-gray-100 dark:border-white/5 hover:border-gold-500/40 transition-all duration-300 group">
                     <div className="w-12 h-12 rounded-2xl bg-gold-500/10 text-gold-600 dark:text-gold-400 flex items-center justify-center mb-6 text-xl group-hover:scale-110 transition-transform">
                        <FaGem />
                     </div>
                     <h3 className="font-serif text-2xl text-gray-900 dark:text-white mb-3">
                        Personalized Customer Experience
                     </h3>
                     <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed font-light">
                        We value every customer and aim to provide a welcoming, comfortable, and personalized experience.
                     </p>
                  </div>

                  {/* 3. Smart Appointment Management */}
                  <div className="bg-gray-50 dark:bg-dark-950/60 p-8 rounded-[2.5rem] border border-gray-100 dark:border-white/5 hover:border-gold-500/40 transition-all duration-300 group">
                     <div className="w-12 h-12 rounded-2xl bg-gold-500/10 text-gold-600 dark:text-gold-400 flex items-center justify-center mb-6 text-xl group-hover:scale-110 transition-transform">
                        <FaClock />
                     </div>
                     <h3 className="font-serif text-2xl text-gray-900 dark:text-white mb-3">
                        Smart Appointment Management
                     </h3>
                     <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed font-light">
                        Our digital appointment management system helps organize bookings and makes appointment handling more convenient.
                     </p>
                  </div>

                  {/* 4. Intelligent Staff Management */}
                  <div className="bg-gray-50 dark:bg-dark-950/60 p-8 rounded-[2.5rem] border border-gray-100 dark:border-white/5 hover:border-gold-500/40 transition-all duration-300 group">
                     <div className="w-12 h-12 rounded-2xl bg-gold-500/10 text-gold-600 dark:text-gold-400 flex items-center justify-center mb-6 text-xl group-hover:scale-110 transition-transform">
                        <FaUsers />
                     </div>
                     <h3 className="font-serif text-2xl text-gray-900 dark:text-white mb-3">
                        Intelligent Staff Management
                     </h3>
                     <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed font-light">
                        Our management system supports staff coordination and automated staff assignment to improve workflow efficiency.
                     </p>
                  </div>

                  {/* 5. Efficient Salon Operations */}
                  <div className="bg-gray-50 dark:bg-dark-950/60 p-8 rounded-[2.5rem] border border-gray-100 dark:border-white/5 hover:border-gold-500/40 transition-all duration-300 group md:col-span-2 lg:col-span-1">
                     <div className="w-12 h-12 rounded-2xl bg-gold-500/10 text-gold-600 dark:text-gold-400 flex items-center justify-center mb-6 text-xl group-hover:scale-110 transition-transform">
                        <FaCog />
                     </div>
                     <h3 className="font-serif text-2xl text-gray-900 dark:text-white mb-3">
                        Efficient Salon Operations
                     </h3>
                     <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed font-light">
                        From service management to appointment tracking, our technology helps streamline everyday salon operations.
                     </p>
                  </div>
               </div>
            </div>

            {/* Our Commitment & Experience the Luxe Difference */}
            <div className="bg-gradient-to-br from-gray-900 via-dark-950 to-black text-white p-10 md:p-16 rounded-[3rem] shadow-2xl border border-gold-500/20 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-96 h-96 bg-gold-500/10 rounded-full blur-[100px] pointer-events-none"></div>
               
               <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                  <div className="space-y-6">
                     <span className="text-gold-500 uppercase tracking-[0.3em] text-xs font-bold">
                        Our Promise
                     </span>
                     <h2 className="font-display text-4xl md:text-5xl text-white uppercase leading-tight">
                        Our <span className="italic text-gold-400">Commitment</span>
                     </h2>
                     <p className="text-gray-300 text-base md:text-lg leading-relaxed font-light">
                        At Luxe Salon, customer satisfaction is at the heart of everything we do.
                     </p>
                     <p className="text-gray-400 text-sm md:text-base leading-relaxed font-light">
                        We are committed to maintaining service quality, providing a welcoming environment, improving operational efficiency, and continuously enhancing the customer experience through innovation.
                     </p>
                  </div>

                  <div className="space-y-6 border-t lg:border-t-0 lg:border-l border-white/10 pt-8 lg:pt-0 lg:pl-12">
                     <span className="text-gold-500 uppercase tracking-[0.3em] text-xs font-bold">
                        Elevate Your Visit
                     </span>
                     <h2 className="font-display text-4xl md:text-5xl text-white uppercase leading-tight">
                        Experience the <span className="italic text-gold-400">Luxe Difference</span>
                     </h2>
                     <p className="text-gray-300 text-base md:text-lg leading-relaxed font-light">
                        Whether you are visiting us for professional beauty services or exploring a smarter approach to salon management, Luxe Salon brings together care, convenience, and innovation.
                     </p>
                     <p className="font-serif italic text-gold-400 text-xl font-medium">
                        Luxe Salon — Where Beauty Meets Innovation.
                     </p>
                     <div className="pt-4 flex flex-wrap gap-4">
                        <Link 
                           to={user ? "/dashboard" : "/register"} 
                           className="btn-gold inline-flex items-center gap-3 px-8 py-4 text-xs font-bold uppercase tracking-widest"
                        >
                           {user ? "Book an Appointment" : "Get Started"}
                           <FaArrowRight />
                        </Link>
                        <Link 
                           to="/services" 
                           className="px-8 py-4 border border-white/20 text-white rounded-full text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all"
                        >
                           Explore Services
                        </Link>
                     </div>
                  </div>
               </div>
            </div>

         </div>
      </section>

    </div>
  );
};

export default Home;