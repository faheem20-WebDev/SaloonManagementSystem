import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

const Footer = () => {
    return (
      <footer className="bg-gray-100 dark:bg-dark-950 border-t border-gray-200 dark:border-white/5 pt-20 pb-10 transition-colors duration-500">
        <div className="max-w-[1400px] mx-auto px-6">
           <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-20">
              {/* Brand */}
              <div className="space-y-6 max-w-sm">
                 <div className="font-display text-3xl font-bold tracking-widest text-gray-900 dark:text-white transition-colors">
                    LUXE.
                 </div>
                 <p className="text-gray-600 dark:text-gray-400 font-light leading-relaxed">
                    Redefining beauty with a touch of luxury. Our commitment to excellence ensures that every visit is a transformative experience.
                 </p>
                 <div className="flex gap-4">
                    {[FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn].map((Icon, idx) => (
                       <a key={idx} href="#" className="w-10 h-10 rounded-full border border-gray-300 dark:border-white/10 flex items-center justify-center text-gray-600 dark:text-white hover:bg-gold-500 hover:border-gold-500 hover:text-black transition-all">
                          <Icon size={14} />
                       </a>
                    ))}
                 </div>
              </div>

              {/* Links */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-12 md:gap-24">
                 <div>
                    <h4 className="text-gray-900 dark:text-white font-bold uppercase tracking-widest text-xs mb-6">Explore</h4>
                    <ul className="space-y-4 text-gray-600 dark:text-gray-400 text-sm">
                       {['Home', 'Services', 'About Us', 'Contact'].map(item => (
                          <li key={item}><a href="#" className="hover:text-gold-500 transition-colors">{item}</a></li>
                       ))}
                    </ul>
                 </div>
                 <div>
                    <h4 className="text-gray-900 dark:text-white font-bold uppercase tracking-widest text-xs mb-6">Legal</h4>
                    <ul className="space-y-4 text-gray-600 dark:text-gray-400 text-sm">
                       {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map(item => (
                          <li key={item}><a href="#" className="hover:text-gold-500 transition-colors">{item}</a></li>
                       ))}
                    </ul>
                 </div>
                 <div className="col-span-2 md:col-span-1">
                    <h4 className="text-gray-900 dark:text-white font-bold uppercase tracking-widest text-xs mb-6">Contact</h4>
                    <ul className="space-y-4 text-gray-600 dark:text-gray-400 text-sm">
                       <li>123 Luxury Ave, Beverly Hills</li>
                       <li>+1 (555) 123-4567</li>
                       <li>concierge@luxe.com</li>
                    </ul>
                 </div>
              </div>
           </div>

           <div className="border-t border-gray-200 dark:border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-500 dark:text-gray-600 text-xs tracking-wider">
                 &copy; {new Date().getFullYear()} LUXE SALOON. ALL RIGHTS RESERVED.
              </p>
              <p className="text-gray-500 dark:text-gray-600 text-xs tracking-wider">
                 DESIGNED FOR ELEGANCE
              </p>
           </div>
        </div>
      </footer>
    );
  };
  
  export default Footer;
