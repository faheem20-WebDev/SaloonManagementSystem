import axios from 'axios';

const instance = axios.create({
  // Direct link for deployment
  // NOTE: We removed the trailing slash and will remove leading slashes from requests
  baseURL: 'https://muhammadfaheem52006-saloonmanagementsystembackend.hf.space/api',
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