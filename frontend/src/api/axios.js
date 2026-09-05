import axios from 'axios';

const rawBase = import.meta.env.VITE_API_URL || '/api';
const baseURL = rawBase.startsWith('/') && !rawBase.endsWith('/api')
  ? `${rawBase.replace(/\/$/, '')}/api`
  : rawBase.endsWith('/api')
    ? rawBase
    : `${rawBase.replace(/\/$/, '')}/api`;

const api = axios.create({ baseURL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
