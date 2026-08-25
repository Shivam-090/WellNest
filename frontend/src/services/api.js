/**
 * WellNest AI Core Axios Connection Instance
 * Primary communication bridge between Frontend and Backend
 */

import axios from 'axios';

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Persistent Token Storage Helpers
export const getStoredToken = () => {
  return sessionStorage.getItem('wellnest_token') || localStorage.getItem('wellnest_token') || null;
};

export const getStoredUser = () => {
  const raw = sessionStorage.getItem('wellnest_user') || localStorage.getItem('wellnest_user');
  try {
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const setStoredAuth = (token, user) => {
  if (token) {
    sessionStorage.setItem('wellnest_token', token);
    localStorage.setItem('wellnest_token', token);
  }
  if (user) {
    sessionStorage.setItem('wellnest_user', JSON.stringify(user));
    localStorage.setItem('wellnest_user', JSON.stringify(user));
  }
};

export const clearStoredAuth = () => {
  sessionStorage.removeItem('wellnest_token');
  sessionStorage.removeItem('wellnest_user');
  localStorage.removeItem('wellnest_token');
  localStorage.removeItem('wellnest_user');
};

// Core Axios Instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 120000,
});

// Request Interceptor: Automatically inject JWT Bearer Token
api.interceptors.request.use(
  (config) => {
    const token = getStoredToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle unauthenticated responses (401 Auth Expired)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn('Authentication expired or unauthorized request (401). Triggering session expired flow.');
      const hadToken = !!getStoredToken();
      clearStoredAuth();
      if (hadToken) {
        window.dispatchEvent(
          new CustomEvent('wellnest:auth_expired', {
            detail: {
              message: error.response?.data?.message || 'Your session has expired. Please log in again.'
            }
          })
        );
      }
    }
    return Promise.reject(error);
  }
);

// Export primary instance as default
export default api;

// Re-export modular API services for unified access
export { profileAPI, authAPI, authService } from './profileAPI';
export { checkInAPI, checkInService, assessmentService } from './checkInAPI';
export { chatAPI, chatService } from './chatAPI';
export { tasksAPI, taskService } from './tasksAPI';
export { journeyAPI, journeyService } from './journeyAPI';
