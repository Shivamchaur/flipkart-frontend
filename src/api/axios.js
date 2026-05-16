import axios from 'axios';

const API_URL =
    window.location.hostname === 'localhost'
        ? 'http://localhost:5000/api'
        : 'https://flipkart-backend-psi.vercel.app/api';

const instance = axios.create({
    baseURL: API_URL,
    withCredentials: true,
});

// Request interceptor — attach Bearer token
instance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor — handle 401 Unauthorized globally
instance.interceptors.response.use(
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

export default instance;
