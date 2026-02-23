/**
 * Axios HTTP Client
 * Centralized API client with request/response interceptors
 */

import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import API_CONFIG from './config';

// Create axios instance
export const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
});

// Request interceptor: Add auth token to headers
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Get JWT token from sessionStorage
    const token = sessionStorage.getItem('authToken');

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor: Handle errors globally
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    // Handle 401 Unauthorized - token expired
    if (error.response?.status === 401) {
      // Skip logout for non-critical master data fetches to avoid session termination
      const isMasterData = error.config?.url?.includes('/api/platform/v1/masters');

      if (!isMasterData) {
        // 1. Clear session storage completely
        sessionStorage.clear();

        // 2. Comprehensive localStorage cleanup (preserve theme)
        const themePref = localStorage.getItem('theme');
        localStorage.clear();
        if (themePref) {
          localStorage.setItem('theme', themePref);
        }

        // 3. Force redirect to login which will also clear in-memory cache
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
      }
    }

    // Handle 403 Forbidden - insufficient permissions
    if (error.response?.status === 403) {
      window.location.href = '/unauthorized';
    }

    return Promise.reject(error);
  }
);

export default apiClient;
