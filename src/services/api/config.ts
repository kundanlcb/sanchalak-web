/**
 * API Configuration
 * Centralized config for API base URL and mock mode
 */

export const API_CONFIG = {
  // Use VITE_API_BASE_URL if mock is false.
  // If VITE_API_BASE_URL is not set, use '/api' to allow proxying or same-origin requests.
  BASE_URL: (import.meta.env.VITE_USE_MOCK_API === 'true')
    ? '/api'
    : (import.meta.env.VITE_API_BASE_URL || 'https://lhgsvq3v-8082.inc1.devtunnels.ms/api'),
  USE_MOCK_API: import.meta.env.VITE_USE_MOCK_API === 'true',
  TIMEOUT: 30000, // Increased timeout for bulk uploads
} as const;

export default API_CONFIG;
