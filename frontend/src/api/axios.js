import axios from 'axios';

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true, // Necessary for HttpOnly Cookies
});

// We no longer need the interceptor to manually add the Authorization header
// because cookies are sent automatically by the browser with each request.

export default instance;