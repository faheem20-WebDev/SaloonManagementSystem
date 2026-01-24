import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { FaArrowRight } from 'react-icons/fa';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex bg-gold-50 dark:bg-dark-950 text-gray-900 dark:text-white relative overflow-hidden transition-colors duration-500">
       {/* Ambient Background Lights */}
       <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-gold-400/20 dark:bg-gold-600/20 rounded-full blur-[120px] pointer-events-none"></div>
       <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-500/10 dark:bg-purple-900/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-[1400px] w-full mx-auto flex flex-col md:flex-row relative z-10 h-screen">
        
        {/* Left: Typography & Brand */}
        <div className="hidden md:flex md:w-1/2 flex-col justify-between p-12 border-r border-gray-200 dark:border-white/5">
           <Link to="/" className="text-2xl font-display font-bold text-gray-900 dark:text-white tracking-widest">LUXE.</Link>
           
           <div className="space-y-6">
              <h1 className="font-display text-7xl leading-tight text-gray-900 dark:text-white">
                 Access <br/> 
                 <span className="italic text-gray-500">Exclusivity</span>
              </h1>
              <p className="text-gray-600 dark:text-gray-400 max-w-sm font-light">
                 Manage your appointments, view your history, and unlock premium member benefits.
              </p>
           </div>

           <div className="text-sm text-gray-500 dark:text-gray-600 uppercase tracking-widest">
              © 2026 Luxe Saloon
           </div>
        </div>

        {/* Right: Form */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-8">
           <div className="w-full max-w-sm space-y-10">
              <div className="md:hidden mb-8">
                 <Link to="/" className="text-2xl font-display font-bold text-gray-900 dark:text-white tracking-widest">LUXE.</Link>
              </div>

              <div className="space-y-2">
                 <h2 className="text-3xl font-serif text-gray-900 dark:text-white">Sign In</h2>
                 <p className="text-gray-500 text-sm">Please enter your credentials.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                 <div className="space-y-6">
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
                       <label htmlFor="password" className="absolute left-0 -top-3.5 text-gray-500 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-gold-500 peer-focus:text-sm">Password</label>
                    </div>
                 </div>

                 <div className="flex items-center justify-between">
                    <button type="submit" className="group flex items-center gap-4 text-xl font-display text-gray-900 dark:text-white hover:text-gold-500 dark:hover:text-gold-400 transition-colors">
                       Enter Dashboard <FaArrowRight className="group-hover:translate-x-2 transition-transform" />
                    </button>
                 </div>
              </form>

              <div className="pt-10 border-t border-gray-200 dark:border-white/5">
                 <p className="text-gray-500">Not a member yet?</p>
                 <Link to="/register" className="text-gray-900 dark:text-white hover:text-gold-500 transition-colors font-medium">Request Access</Link>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};

export default Login;