import axios from 'axios';

const instance = axios.create({
  // Adding the trailing slash is CRITICAL for Axios to join paths correctly
  baseURL: 'https://muhammadfaheem52006-saloonmanagementsystembackend.hf.space/api/',
});

// Add a request interceptor
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;