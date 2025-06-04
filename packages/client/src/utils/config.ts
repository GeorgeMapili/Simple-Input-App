/**
 * Utility functions for configuration
 */

/**
 * Get the API URL from environment variables
 */
export function getApiUrl(): string {
  return import.meta.env.VITE_API_URL || "http://localhost:3001/trpc";
}
