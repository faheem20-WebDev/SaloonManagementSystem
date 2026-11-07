import { createContext, useState, useEffect } from 'react';
import api from '../api/axios';
import { toast } from 'react-toastify';

export const AuthContext = createContext(); // Named Export

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyUser = async () => {
      const savedUserStr = localStorage.getItem('user');
      let token = null;
      let savedUser = null;

      try {
        savedUser = savedUserStr ? JSON.parse(savedUserStr) : null;
        token = savedUser?.token;
      } catch (e) {
        // Corrupted JSON in localStorage
        localStorage.removeItem('user');
        setUser(null);
        setLoading(false);
        return;
      }

      // 1. Guest visitor check: If no token exists, skip the protected /auth/me call
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      // 2. Logged-in user: Verify stored session with backend
      try {
        const { data } = await api.get('auth/me');
        const updatedUser = { ...savedUser, ...data };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
      } catch (error) {
        const status = error.response?.status;

        if (status === 401 || status === 403) {
          // Token is definitively expired, invalid, or revoked: clear invalid session
          console.warn("Session expired or token invalid. Session cleared.");
          setUser(null);
          localStorage.removeItem('user');
        } else {
          // Transient network error (offline, timeout, 5xx server error):
          // Preserve the existing session in localStorage so the user is not logged out unnecessarily
          console.warn("Network error during session verification. Preserving cached session:", error.message);
          if (savedUser) {
            setUser(savedUser);
          }
        }
      } finally {
        setLoading(false);
      }
    };

    verifyUser();
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await api.post('auth/login', { email, password });
      // We keep user object (including token) in localStorage for local dev fallback
      localStorage.setItem('user', JSON.stringify(data));
      setUser(data);
      toast.success(`Welcome back, ${data.name}!`);
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
      return false;
    }
  };

  const register = async (name, email, password) => {
    try {
      const { data } = await api.post('auth/register', { name, email, password });
      localStorage.setItem('user', JSON.stringify(data));
      setUser(data);
      toast.success('Registration successful!');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
      return false;
    }
  };

  const logout = async () => {
    try {
      await api.get('auth/logout');
    } catch (error) {
      console.error("Logout error", error);
    } finally {
      localStorage.removeItem('user');
      setUser(null);
      toast.info('Logged out successfully');
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider; // Component is now the Default Export