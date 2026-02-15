/**
 * API Configuration
 * Centralized config for API base URL and mock mode
 */

export const API_CONFIG = {
  // If using mocks, force relative path to ensure MSW interception works across origins
  BASE_URL: (import.meta.env.VITE_USE_MOCK_API === 'true')
    ? '/api'
    : 'https://lhgsvq3v-8082.inc1.devtunnels.ms/',
  USE_MOCK_API: import.meta.env.VITE_USE_MOCK_API === 'true',
  TIMEOUT: 10000, // 10 seconds
} as const;

export default API_CONFIG;
