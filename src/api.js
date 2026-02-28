import axios from 'axios';

const rawApiBase = import.meta.env.VITE_API_URL || '';
const normalizedBaseURL = rawApiBase
    .replace(/\/+$/, '')
    .replace(/\/api$/, '');

const api = axios.create({
    baseURL: normalizedBaseURL,
});

api.interceptors.request.use(
    (config) => {
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            if (userInfo?.token) {
                config.headers.Authorization = `Bearer ${userInfo.token}`;
            }
        } catch (_) {}
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('userInfo');
            const path = window.location.pathname || '';
            if (!path.startsWith('/login') && !path.startsWith('/register') && !path.startsWith('/forgot-password')) {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
