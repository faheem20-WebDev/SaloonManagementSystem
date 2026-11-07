import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { toast } from 'react-toastify';
import { FaArrowRight, FaArrowLeft, FaCheckCircle, FaExclamationTriangle, FaSpinner, FaEnvelope } from 'react-icons/fa';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('idle'); // 'idle' | 'success' | 'error'
  const [responseMessage, setResponseMessage] = useState('');
  const [errorDetails, setErrorDetails] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !email.trim()) {
      toast.error('Please enter your email address');
      return;
    }

    setLoading(true);
    setStatus('idle');
    setResponseMessage('');
    setErrorDetails('');

    try {
      const response = await api.post('auth/forgot-password', {
        email: email.trim(),
      });

      if (response.data && response.data.success) {
        setStatus('success');
        setResponseMessage(response.data.message || 'Password reset link sent to your email.');
        toast.success('Password reset link sent!');
      } else {
        // Defensive check: If server didn't explicitly return success=true
        setStatus('error');
        setResponseMessage(response.data?.message || 'Failed to send password reset email.');
        toast.error('Unable to send reset email');
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      setStatus('error');

      const serverMessage = error.response?.data?.message || error.message || 'Failed to send password reset email.';
      setResponseMessage(serverMessage);

      // Check if server returned additional safe delivery details
      const detailsMsg = error.response?.data?.details?.message || error.response?.data?.details;
      if (detailsMsg && detailsMsg !== serverMessage) {
        setErrorDetails(detailsMsg);
      }

      toast.error(serverMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gold-50 dark:bg-dark-950 text-gray-900 dark:text-white relative overflow-hidden transition-colors duration-500">
      {/* Ambient Background Lights */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-gold-400/20 dark:bg-gold-600/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-500/10 dark:bg-purple-900/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-[1400px] w-full mx-auto flex flex-col md:flex-row relative z-10 h-screen">
        
        {/* Left: Brand & Editorial */}
        <div className="hidden md:flex md:w-1/2 flex-col justify-between p-12 border-r border-gray-200 dark:border-white/5">
          <Link to="/" className="text-2xl font-display font-bold text-gray-900 dark:text-white tracking-widest">LUXE.</Link>
          
          <div className="space-y-6">
            <h1 className="font-display text-7xl leading-tight text-gray-900 dark:text-white">
              Account <br/> 
              <span className="italic text-gray-500">Recovery</span>
            </h1>
            <p className="text-gray-600 dark:text-gray-400 max-w-sm font-light">
              Securely restore access to your appointments, VIP bookings, and membership portfolio.
            </p>
          </div>

          <div className="text-sm text-gray-500 dark:text-gray-600 uppercase tracking-widest">
            © 2026 Luxe Saloon
          </div>
        </div>

        {/* Right: Form Area */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-8 overflow-y-auto">
          <div className="w-full max-w-md space-y-8">
            <div className="md:hidden mb-6">
              <Link to="/" className="text-2xl font-display font-bold text-gray-900 dark:text-white tracking-widest">LUXE.</Link>
            </div>

            {/* Header */}
            <div className="space-y-2">
              <h2 className="text-3xl font-serif text-gray-900 dark:text-white">Forgot Password</h2>
              <p className="text-gray-500 text-sm">
                Enter your registered email address and we'll send you a secure link to reset your password.
              </p>
            </div>

            {/* Error Banner */}
            {status === 'error' && (
              <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-700 dark:text-red-400 space-y-2 animate-fadeIn">
                <div className="flex items-start gap-3">
                  <FaExclamationTriangle className="mt-1 flex-shrink-0 text-red-500" />
                  <div className="text-sm">
                    <p className="font-semibold">Unable to Send Reset Link</p>
                    <p className="mt-1 text-xs opacity-90">{responseMessage}</p>
                    {errorDetails && (
                      <p className="mt-2 text-xs italic bg-red-500/5 p-2 rounded border border-red-500/10">
                        {errorDetails}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Success State */}
            {status === 'success' ? (
              <div className="p-6 rounded-xl bg-gold-500/10 border border-gold-500/30 text-gray-900 dark:text-white space-y-5 animate-fadeIn">
                <div className="flex items-center gap-3 text-gold-500 dark:text-gold-400">
                  <FaCheckCircle className="text-2xl flex-shrink-0" />
                  <h3 className="text-xl font-serif">Check Your Inbox</h3>
                </div>
                
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  If an account is associated with <strong className="text-gold-600 dark:text-gold-400">{email}</strong>, a password reset link has been dispatched. Please check your inbox and follow the instructions to reset your password.
                </p>

                <div className="p-3 bg-black/5 dark:bg-white/5 rounded text-xs text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-white/5">
                  <span className="font-semibold text-gold-500">Note:</span> The link is valid for 30 minutes. If you do not see it in a few minutes, check your spam or junk folder.
                </div>

                <div className="pt-2 flex flex-col sm:flex-row gap-4 items-center justify-between">
                  <button
                    type="button"
                    onClick={() => {
                      setStatus('idle');
                      setResponseMessage('');
                    }}
                    className="text-xs uppercase tracking-wider text-gray-500 hover:text-gold-500 dark:hover:text-gold-400 transition-colors"
                  >
                    Send to different email
                  </button>

                  <Link
                    to="/login"
                    className="group flex items-center gap-2 text-sm font-display text-gray-900 dark:text-white hover:text-gold-500 dark:hover:text-gold-400 transition-colors"
                  >
                    <FaArrowLeft className="text-xs group-hover:-translate-x-1 transition-transform" /> Return to Sign In
                  </Link>
                </div>
              </div>
            ) : (
              /* Request Form */
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-6">
                  <div className="group relative">
                    <input 
                      type="email" 
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={loading}
                      className="w-full bg-transparent border-b border-gray-300 dark:border-gray-700 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-gold-500 transition-colors peer placeholder-transparent disabled:opacity-50"
                      placeholder="Email Address"
                      id="reset-email"
                    />
                    <label 
                      htmlFor="reset-email" 
                      className="absolute left-0 -top-3.5 text-gray-500 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-gold-500 peer-focus:text-sm"
                    >
                      Email Address
                    </label>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full sm:w-auto group flex items-center justify-center gap-4 text-xl font-display text-gray-900 dark:text-white hover:text-gold-500 dark:hover:text-gold-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <FaSpinner className="animate-spin text-gold-500" />
                        <span>Sending Link...</span>
                      </>
                    ) : (
                      <>
                        <span>Send Reset Link</span>
                        <FaArrowRight className="group-hover:translate-x-2 transition-transform" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* Back to Login Link */}
            <div className="pt-8 border-t border-gray-200 dark:border-white/5 flex items-center justify-between">
              <Link 
                to="/login" 
                className="group flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gold-500 dark:hover:text-gold-400 transition-colors font-medium"
              >
                <FaArrowLeft className="text-xs group-hover:-translate-x-1 transition-transform" />
                Back to Sign In
              </Link>

              <Link 
                to="/register" 
                className="text-sm text-gray-500 hover:text-gold-500 dark:hover:text-gold-400 transition-colors"
              >
                Create Account
              </Link>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default ForgotPassword;
