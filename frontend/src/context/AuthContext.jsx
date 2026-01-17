import { createContext, useState, useEffect } from 'react';
import api from '../api/axios';
import { toast } from 'react-toastify';
import jwt_decode from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Initialize state from localStorage immediately (Synchronous)
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const decoded = jwt_decode(token);
          // Check if token is expired
          if (decoded.exp * 1000 < Date.now()) {
             logout();
          } else {
             // Validate token with backend
             const { data } = await api.get('auth/me');
             setUser(data);
             localStorage.setItem('user', JSON.stringify(data));
          }
        } catch (error) {
          console.error("Token verification failed", error);
          // Only logout if it's a 401 Unauthorized error
          if (error.response?.status === 401) {
            logout();
          }
        }
      } else {
          setUser(null);
          localStorage.removeItem('user');
      }
      setLoading(false);
    };
    verifyToken();
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await api.post('auth/login', { email, password });
      localStorage.setItem('token', data.token);
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
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
      setUser(data);
      toast.success('Registration successful!');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    toast.info('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
