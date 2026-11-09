import { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FaCut, FaGem, FaClock, FaUsers, FaCog, FaArrowRight } from 'react-icons/fa';

const About = () => {
  const { user } = useContext(AuthContext);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen pt-32 pb-24 px-6 transition-colors duration-500">
      <div className="max-w-7xl mx-auto space-y-24">
        
        {/* 1. Beauty Meets Innovation Hero */}
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
              <h1 className="font-display text-5xl md:text-7xl lg:text-8xl text-gray-900 dark:text-white leading-tight uppercase">
                Beauty <br/> <span className="italic text-gold-600 dark:text-gold-500">Meets</span> <br/> Innovation
              </h1>
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

        {/* 2. Our Mission & Our Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-gray-200 dark:border-white/10">
          <div className="bg-white/80 dark:bg-dark-900/60 p-8 md:p-10 rounded-[2.5rem] border border-gray-200/80 dark:border-white/5 space-y-4 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-gold-500/10 text-gold-600 dark:text-gold-400 flex items-center justify-center text-xl">
              <FaCut />
            </div>
            <h2 className="font-display text-3xl md:text-4xl text-gray-900 dark:text-white uppercase">
              Our <span className="italic text-gold-600 dark:text-gold-500">Mission</span>
            </h2>
            <div className="space-y-3 text-gray-600 dark:text-gray-400 text-sm md:text-base leading-relaxed font-light">
              <p>
                Our mission is to deliver high-quality beauty and grooming services while making every customer's experience convenient, comfortable, and personalized.
              </p>
              <p>
                We also aim to simplify salon operations through modern technology, helping our team manage appointments, services, and staff more efficiently.
              </p>
            </div>
          </div>

          <div className="bg-white/80 dark:bg-dark-900/60 p-8 md:p-10 rounded-[2.5rem] border border-gray-200/80 dark:border-white/5 space-y-4 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-gold-500/10 text-gold-600 dark:text-gold-400 flex items-center justify-center text-xl">
              <FaGem />
            </div>
            <h2 className="font-display text-3xl md:text-4xl text-gray-900 dark:text-white uppercase">
              Our <span className="italic text-gold-600 dark:text-gold-500">Vision</span>
            </h2>
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

        {/* 3. What Makes Luxe Salon Different? */}
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
            {/* Professional Beauty Services */}
            <div className="bg-white/80 dark:bg-dark-900/60 p-8 rounded-[2.5rem] border border-gray-200/80 dark:border-white/5 hover:border-gold-500/40 transition-all duration-300 group">
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

            {/* Personalized Customer Experience */}
            <div className="bg-white/80 dark:bg-dark-900/60 p-8 rounded-[2.5rem] border border-gray-200/80 dark:border-white/5 hover:border-gold-500/40 transition-all duration-300 group">
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

            {/* Smart Appointment Management */}
            <div className="bg-white/80 dark:bg-dark-900/60 p-8 rounded-[2.5rem] border border-gray-200/80 dark:border-white/5 hover:border-gold-500/40 transition-all duration-300 group">
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

            {/* Intelligent Staff Management */}
            <div className="bg-white/80 dark:bg-dark-900/60 p-8 rounded-[2.5rem] border border-gray-200/80 dark:border-white/5 hover:border-gold-500/40 transition-all duration-300 group">
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

            {/* Efficient Salon Operations */}
            <div className="bg-white/80 dark:bg-dark-900/60 p-8 rounded-[2.5rem] border border-gray-200/80 dark:border-white/5 hover:border-gold-500/40 transition-all duration-300 group md:col-span-2 lg:col-span-1">
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

        {/* 4. Our Commitment & Experience the Luxe Difference */}
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
    </div>
  );
};

export default About;
