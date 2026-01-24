import axios from 'axios';

// Professional way: Priority to ENV, then Fallback
const BACKEND_URL = import.meta.env.VITE_API_URL || 'https://muhammadfaheem52006-saloonmanagementsystembackend.hf.space/api';

const instance = axios.create({
  baseURL: BACKEND_URL,
  withCredentials: true, 
});

// Fallback for local development: Add token to headers if it exists in localStorage
instance.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user && user.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

console.log("Axios connected to:", BACKEND_URL); 

export default instance;