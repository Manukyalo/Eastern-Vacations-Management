import axios from 'axios';

// Auto-detect if we are running in the browser on Vercel/Production
const getBaseUrl = () => {
    if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;
    if (typeof window !== 'undefined' && window.location.origin.includes('vercel.app')) {
        return window.location.origin; // In production, API and frontend share the same origin
    }
    return 'http://localhost:5000'; // Local development fallback
};

const api = axios.create({
    baseURL: `${getBaseUrl()}/api`,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Attach JWT token automatically to every request if available
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// --- Auth Endpoints ---
export const authAPI = {
    login: (credentials) => api.post('/auth/login', credentials),
    getProfile: () => api.get('/auth/me'),
};

// --- Booking Endpoints ---
export const bookingAPI = {
    getAll: () => api.get('/bookings'),
    getStats: () => api.get('/bookings/stats'),
    create: (data) => api.post('/bookings', data),
    update: (id, data) => api.put(`/bookings/${id}`, data),
    delete: (id) => api.delete(`/bookings/${id}`),
};

// --- Driver Endpoints ---
export const driverAPI = {
    getAll: () => api.get('/drivers'),
    create: (data) => api.post('/drivers', data),
    update: (id, data) => api.put(`/drivers/${id}`, data),
    delete: (id) => api.delete(`/drivers/${id}`),
};

// --- Vehicle Endpoints ---
export const vehicleAPI = {
    getAll: () => api.get('/vehicles'),
    create: (data) => api.post('/vehicles', data),
    update: (id, data) => api.put(`/vehicles/${id}`, data),
    delete: (id) => api.delete(`/vehicles/${id}`),
};

export default api;
