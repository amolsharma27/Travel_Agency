import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      // Token expired or unauthorized
      if (window.location.pathname.startsWith('/dashboard') || window.location.pathname.startsWith('/agency') || window.location.pathname.startsWith('/admin')) {
        // Optionally redirect to login if session expired
      }
    }
    return Promise.reject(error);
  }
);

export default api;
