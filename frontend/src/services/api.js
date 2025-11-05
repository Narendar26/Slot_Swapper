import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const apiClient = axios.create({
  baseURL: API_URL,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  register: (data) => apiClient.post('/auth/register', data),
  login: (data) => apiClient.post('/auth/login', data),
  getCurrentUser: () => apiClient.get('/auth/me'),
};

export const eventService = {
  getMyEvents: () => apiClient.get('/events'),
  createEvent: (data) => apiClient.post('/events', data),
  getEvent: (id) => apiClient.get(`/events/${id}`),
  updateEventStatus: (id, status) => apiClient.patch(`/events/${id}`, { status }),
  deleteEvent: (id) => apiClient.delete(`/events/${id}`),
};

export const swapService = {
  getSwappableSlots: () => apiClient.get('/swaps/swappable-slots'),
  requestSwap: (data) => apiClient.post('/swaps/request', data),
  getIncomingRequests: () => apiClient.get('/swaps/incoming'),
  getOutgoingRequests: () => apiClient.get('/swaps/outgoing'),
  respondToSwapRequest: (requestId, accept) =>
    apiClient.post(`/swaps/respond/${requestId}`, { accept }),
};

export default apiClient;