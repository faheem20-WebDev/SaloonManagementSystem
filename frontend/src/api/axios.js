import axios from 'axios';

// Automatic environment detection:
// When running locally in browser (localhost / 127.0.0.1), route to local Express backend (http://localhost:5000/api)
// When deployed, prioritize VITE_API_URL, then fall back to production endpoint
const getBackendUrl = () => {
  if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
    return import.meta.env.VITE_DEV_API_URL || 'http://localhost:5000/api';
  }
  return import.meta.env.VITE_API_URL || 'https://muhammadfaheem52006-saloonmanagementsystembackend.hf.space/api';
};

const BACKEND_URL = getBackendUrl();

const instance = axios.create({
  baseURL: BACKEND_URL,
});

// Attach token from localStorage to headers for cross-origin authentication
instance.interceptors.request.use((config) => {
  try {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      if (user && user.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
      }
    }
  } catch (err) {
    console.error('Error reading auth token:', err);
  }
  return config;
});

console.log("Axios connected to:", BACKEND_URL); 

export default instance;