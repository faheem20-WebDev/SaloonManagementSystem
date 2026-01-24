import axios from 'axios';

// Professional way: Priority to ENV, then Fallback
const BACKEND_URL = import.meta.env.VITE_API_URL || 'https://muhammadfaheem52006-saloonmanagementsystembackend.hf.space/api';

const instance = axios.create({
  baseURL: BACKEND_URL,
  withCredentials: true, 
});

console.log("Axios connected to:", BACKEND_URL); // Debugging line

export default instance;