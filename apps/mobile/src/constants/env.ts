/**
 * Environment Configuration
 * Centralized access to environment variables
 */

import Constants from 'expo-constants';

// Get extra config from app.config.js
const extra = Constants.expoConfig?.extra || {};

// Type-safe environment variables
export const ENV = {
  API_BASE_URL: extra.API_BASE_URL || 'http://localhost:8080',
  USE_MOCKS: extra.USE_MOCKS === 'true' || extra.USE_MOCKS === true,
  NODE_ENV: process.env.NODE_ENV || 'development',
} as const;

// Helper to check if running in development
export const isDevelopment = ENV.NODE_ENV === 'development';

// Helper to check if using mocks
export const useMocks = ENV.USE_MOCKS;

export default ENV;
