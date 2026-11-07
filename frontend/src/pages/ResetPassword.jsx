import { useState } from 'react';
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { toast } from 'react-toastify';
import { FaArrowRight, FaArrowLeft, FaEye, FaEyeSlash, FaCheckCircle, FaExclamationTriangle, FaSpinner, FaLock } from 'react-icons/fa';

const ResetPassword = () => {
  const { token: paramToken } = useParams();
  const [searchParams] = useSearchParams();
  const token = paramToken || searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('idle'); // 'idle' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      setErrorMessage('Missing password reset token. Please request a new link.');
      setStatus('error');
      toast.error('Reset token missing');
      return;
    }

    if (password.length < 8) {
      setErrorMessage('Password must be at least 8 characters long.');
      setStatus('error');
      toast.error('Password too short (min 8 characters)');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      setStatus('error');
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    setStatus('idle');
    setErrorMessage('');

    try {
      const response = await api.post(`auth/reset-password/${token}`, {
        token,
        password,
      });

      if (response.data && response.data.success) {
        setStatus('success');
        setSuccessMessage(response.data.message || 'Password reset successful! You can now log in.');
        toast.success('Password reset successfully!');

        // Automatically redirect to login after 3.5 seconds
        setTimeout(() => {
          navigate('/login');
        }, 3500);
      } else {
        setStatus('error');
        setErrorMessage(response.data?.message || 'Failed to reset password.');
        toast.error('Reset failed');
      }
    } catch (error) {
      console.error('Reset password error:', error);
      setStatus('error');
      const msg = error.response?.data?.message || error.message || 'Failed to reset password. The link may have expired.';
      setErrorMessage(msg);
      toast.error(msg);
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
        
        {/* Left: Brand / Typography */}
        <div className="hidden md:flex md:w-1/2 flex-col justify-between p-12 border-r border-gray-200 dark:border-white/5">
          <Link to="/" className="text-2xl font-display font-bold text-gray-900 dark:text-white tracking-widest">LUXE.</Link>
          
          <div className="space-y-6">
            <h1 className="font-display text-7xl leading-tight text-gray-900 dark:text-white">
              Create New <br/> 
              <span className="italic text-gray-500">Password</span>
            </h1>
            <p className="text-gray-600 dark:text-gray-400 max-w-sm font-light">
              Choose a strong, memorable password to protect your bookings and profile.
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
              <h2 className="text-3xl font-serif text-gray-900 dark:text-white">Reset Password</h2>
              <p className="text-gray-500 text-sm">
                Enter and confirm your new credentials below.
              </p>
            </div>

            {/* Missing Token Alert */}
            {!token && (
              <div className="p-5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-400 space-y-3">
                <div className="flex items-center gap-3">
                  <FaExclamationTriangle className="text-xl flex-shrink-0" />
                  <p className="font-medium text-sm">No Reset Token Found</p>
                </div>
                <p className="text-xs opacity-90 leading-relaxed">
                  The password reset link appears incomplete or missing the required token. Please initiate a new recovery request.
                </p>
                <div className="pt-2">
                  <Link
                    to="/forgot-password"
                    className="inline-flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-amber-600 dark:text-amber-400 hover:underline"
                  >
                    Request New Reset Link &rarr;
                  </Link>
                </div>
              </div>
            )}

            {/* Error Banner */}
            {status === 'error' && (
              <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-700 dark:text-red-400 space-y-2 animate-fadeIn">
                <div className="flex items-start gap-3">
                  <FaExclamationTriangle className="mt-1 flex-shrink-0 text-red-500" />
                  <div className="text-sm">
                    <p className="font-semibold">Reset Failed</p>
                    <p className="mt-1 text-xs opacity-90">{errorMessage}</p>
                    <div className="mt-3">
                      <Link
                        to="/forgot-password"
                        className="text-xs uppercase tracking-wider text-red-600 dark:text-red-400 underline font-medium hover:opacity-80"
                      >
                        Request a fresh link
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Success Banner */}
            {status === 'success' ? (
              <div className="p-6 rounded-xl bg-gold-500/10 border border-gold-500/30 text-gray-900 dark:text-white space-y-5 animate-fadeIn">
                <div className="flex items-center gap-3 text-gold-500 dark:text-gold-400">
                  <FaCheckCircle className="text-2xl flex-shrink-0" />
                  <h3 className="text-xl font-serif">Password Updated!</h3>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  {successMessage}
                </p>

                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Redirecting to Sign In in a few seconds...
                </p>

                <div className="pt-2">
                  <Link
                    to="/login"
                    className="w-full group flex items-center justify-center gap-3 py-3 px-6 bg-gold-500 text-dark-950 font-display font-semibold uppercase tracking-wider text-sm rounded hover:bg-gold-400 transition-colors shadow-lg"
                  >
                    Proceed to Sign In <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            ) : (
              /* Reset Form */
              token && (
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="space-y-6">
                    
                    {/* New Password */}
                    <div className="group relative">
                      <input 
                        type={showPassword ? 'text' : 'password'}
                        required
                        minLength={8}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={loading}
                        className="w-full bg-transparent border-b border-gray-300 dark:border-gray-700 py-3 pr-10 text-gray-900 dark:text-white focus:outline-none focus:border-gold-500 transition-colors peer placeholder-transparent disabled:opacity-50"
                        placeholder="New Password"
                        id="new-password"
                      />
                      <label 
                        htmlFor="new-password" 
                        className="absolute left-0 -top-3.5 text-gray-500 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-gold-500 peer-focus:text-sm"
                      >
                        New Password (min 8 characters)
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-0 top-3 text-gray-400 hover:text-gold-500 transition-colors"
                        tabIndex={-1}
                        aria-label="Toggle password visibility"
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>

                    {/* Confirm New Password */}
                    <div className="group relative">
                      <input 
                        type={showConfirmPassword ? 'text' : 'password'}
                        required
                        minLength={8}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        disabled={loading}
                        className="w-full bg-transparent border-b border-gray-300 dark:border-gray-700 py-3 pr-10 text-gray-900 dark:text-white focus:outline-none focus:border-gold-500 transition-colors peer placeholder-transparent disabled:opacity-50"
                        placeholder="Confirm New Password"
                        id="confirm-password"
                      />
                      <label 
                        htmlFor="confirm-password" 
                        className="absolute left-0 -top-3.5 text-gray-500 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-gold-500 peer-focus:text-sm"
                      >
                        Confirm New Password
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-0 top-3 text-gray-400 hover:text-gold-500 transition-colors"
                        tabIndex={-1}
                        aria-label="Toggle confirm password visibility"
                      >
                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>

                  </div>

                  <div className="flex items-center justify-between">
                    <button 
                      type="submit" 
                      disabled={loading}
                      className="group flex items-center gap-4 text-xl font-display text-gray-900 dark:text-white hover:text-gold-500 dark:hover:text-gold-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <>
                          <FaSpinner className="animate-spin text-gold-500" />
                          <span>Updating Password...</span>
                        </>
                      ) : (
                        <>
                          <span>Set New Password</span>
                          <FaArrowRight className="group-hover:translate-x-2 transition-transform" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )
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
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default ResetPassword;
