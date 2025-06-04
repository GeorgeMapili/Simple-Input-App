import { createTRPCReact } from "@trpc/react-query";
import { httpBatchLink } from "@trpc/client";
import type { AppRouter } from "../../../server/src/trpc";

// Read API URL from environment variables (with fallback)
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/trpc";

// Create tRPC client with React hooks
export const trpc = createTRPCReact<AppRouter>();

// tRPC client options
export const trpcClientOptions = {
  links: [
    httpBatchLink({
      url: API_URL,
    }),
  ],
};
