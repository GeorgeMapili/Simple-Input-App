/**
 * Shared constants used across the application
 */

/**
 * Input text constraints
 */
export const INPUT_CONSTRAINTS = {
  MIN_LENGTH: 1,
  MAX_LENGTH: 255,
};

/**
 * API endpoints
 */
export const API_ENDPOINTS = {
  BASE_URL: "/trpc",
  INPUTS: "inputs",
};

/**
 * Time constants (in milliseconds)
 */
export const TIME = {
  REQUEST_TIMEOUT: 5000, // 5 seconds
  STALE_TIME: 60 * 1000, // 1 minute
};
