import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Bookings API
export const bookingsAPI = {
  getAll: () => api.get('/bookings'),
  getOne: (id) => api.get(`/bookings/${id}`),
  create: (data) => api.post('/bookings', data),
  update: (id, data) => api.put(`/bookings/${id}`, data),
  assign: (id, driverId, vehicleId) => api.put(`/bookings/${id}/assign`, { driverId, vehicleId }),
  delete: (id) => api.delete(`/bookings/${id}`),
};

// Drivers API
export const driversAPI = {
  getAll: () => api.get('/drivers'),
  getAvailable: () => api.get('/drivers/available'),
  getOne: (id) => api.get(`/drivers/${id}`),
  create: (data) => api.post('/drivers', data),
  update: (id, data) => api.put(`/drivers/${id}`, data),
  delete: (id) => api.delete(`/drivers/${id}`),
};

// Vehicles API
export const vehiclesAPI = {
  getAll: () => api.get('/vehicles'),
  getAvailable: () => api.get('/vehicles/available'),
  getExpiringInsurance: () => api.get('/vehicles/insurance-expiring'),
  getOne: (id) => api.get(`/vehicles/${id}`),
  create: (data) => api.post('/vehicles', data),
  update: (id, data) => api.put(`/vehicles/${id}`, data),
  delete: (id) => api.delete(`/vehicles/${id}`),
};

// Users API
export const usersAPI = {
  getAll: () => api.get('/users'),
  getOne: (id) => api.get(`/users/${id}`),
  update: (id, data) => api.put(`/users/${id}`, data),
  updatePassword: (id, passwords) => api.put(`/users/${id}/password`, passwords),
  delete: (id) => api.delete(`/users/${id}`),
};

export default api;
