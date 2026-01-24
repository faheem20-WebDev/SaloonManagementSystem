import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { FaArrowRight } from 'react-icons/fa';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await register(name, email, password);
    if (success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex bg-gold-50 dark:bg-dark-950 text-gray-900 dark:text-white relative overflow-hidden transition-colors duration-500">
       <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-gold-400/20 dark:bg-gold-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-[1400px] w-full mx-auto flex flex-col md:flex-row relative z-10 h-screen">
        
        {/* Left: Form */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-8 order-2 md:order-1">
           <div className="w-full max-w-sm space-y-10">
              <div className="md:hidden mb-8">
                 <Link to="/" className="text-2xl font-display font-bold text-gray-900 dark:text-white tracking-widest">LUXE.</Link>
              </div>

              <div className="space-y-2">
                 <h2 className="text-3xl font-serif text-gray-900 dark:text-white">Apply for Membership</h2>
                 <p className="text-gray-500 text-sm">Begin your journey with us.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                 <div className="space-y-6">
                    <div className="group relative">
                       <input 
                         type="text" 
                         required
                         value={name}
                         onChange={(e) => setName(e.target.value)}
                         className="w-full bg-transparent border-b border-gray-300 dark:border-gray-700 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-gold-500 transition-colors peer placeholder-transparent"
                         placeholder="Name"
                         id="name"
                       />
                       <label htmlFor="name" className="absolute left-0 -top-3.5 text-gray-500 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-gold-500 peer-focus:text-sm">Full Name</label>
                    </div>

                    <div className="group relative">
                       <input 
                         type="email" 
                         required
                         value={email}
                         onChange={(e) => setEmail(e.target.value)}
                         className="w-full bg-transparent border-b border-gray-300 dark:border-gray-700 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-gold-500 transition-colors peer placeholder-transparent"
                         placeholder="Email"
                         id="email"
                       />
                       <label htmlFor="email" className="absolute left-0 -top-3.5 text-gray-500 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-gold-500 peer-focus:text-sm">Email Address</label>
                    </div>

                    <div className="group relative">
                       <input 
                         type="password" 
                         required
                         value={password}
                         onChange={(e) => setPassword(e.target.value)}
                         className="w-full bg-transparent border-b border-gray-300 dark:border-gray-700 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-gold-500 transition-colors peer placeholder-transparent"
                         placeholder="Password"
                         id="password"
                       />
                       <label htmlFor="password" className="absolute left-0 -top-3.5 text-gray-500 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-gold-500 peer-focus:text-sm">Create Password</label>
                    </div>
                 </div>

                 <div className="flex items-center justify-between">
                    <button type="submit" className="group flex items-center gap-4 text-xl font-display text-gray-900 dark:text-white hover:text-gold-500 dark:hover:text-gold-400 transition-colors">
                       Join Luxe <FaArrowRight className="group-hover:translate-x-2 transition-transform" />
                    </button>
                 </div>
              </form>

              <div className="pt-10 border-t border-gray-200 dark:border-white/5">
                 <p className="text-gray-500">Already a member?</p>
                 <Link to="/login" className="text-gray-900 dark:text-white hover:text-gold-500 transition-colors font-medium">Sign In</Link>
              </div>
           </div>
        </div>

        {/* Right: Typography & Brand */}
        <div className="hidden md:flex md:w-1/2 flex-col justify-between p-12 border-l border-gray-200 dark:border-white/5 order-1 md:order-2 bg-[url('https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1978&q=80')] bg-cover bg-center grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-1000">
           <div className="flex justify-end">
              <Link to="/" className="text-2xl font-display font-bold text-white tracking-widest drop-shadow-lg">LUXE.</Link>
           </div>
           
           <div className="space-y-6 relative z-10 text-right">
              <h1 className="font-display text-7xl leading-tight text-white drop-shadow-2xl">
                 Define <br/> 
                 <span className="italic">Yourself</span>
              </h1>
           </div>
        </div>

      </div>
    </div>
  );
};

export default Register;