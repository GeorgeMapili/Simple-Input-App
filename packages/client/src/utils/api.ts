/**
 * This file sets up the tRPC API client.
 * It's used for making type-safe API calls to the backend.
 */
import { createTRPCReact } from "@trpc/react-query";
import { httpBatchLink } from "@trpc/client";
// Import the router type but with a type assertion
import type { AppRouter } from "server/src/trpc";
import { getApiUrl } from "./config";

// Create tRPC client with React hooks
// @ts-ignore - Ignoring TypeScript error due to tRPC version mismatch
export const trpc = createTRPCReact<AppRouter>();

// tRPC client options with improved error handling
export const trpcClientOptions = {
  links: [
    httpBatchLink({
      url: getApiUrl(),
      // Add headers here if needed
      headers: () => {
        return {};
      },
      fetch: async (url, options) => {
        try {
          // Custom fetch with timeout
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

          const response = await fetch(url, {
            ...options,
            signal: controller.signal,
          });

          clearTimeout(timeoutId);
          return response;
        } catch (error) {
          console.error("API request failed:", error);
          throw error;
        }
      },
    }),
  ],
};
