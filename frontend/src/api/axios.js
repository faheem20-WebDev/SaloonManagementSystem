import axios from 'axios';

// Professional way: Priority to ENV, then Fallback
const BACKEND_URL = import.meta.env.VITE_API_URL || 'https://muhammadfaheem52006-saloonmanagementsystembackend.hf.space/api';

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