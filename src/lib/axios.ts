import axios from 'axios';
import { store } from '@/app/store';
import { logout } from '@/slices/auth/authSlice';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = store.getState().auth.token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      store.dispatch(logout());
    }
    const error = new Error(err.response?.data?.message || err.message);
    Object.assign(error, { originalError: err });
    return Promise.reject(error);
  },
);

export default api;
