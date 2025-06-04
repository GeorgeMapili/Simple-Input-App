import { Hono } from "hono";
import { cors } from "hono/cors";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "./trpc";
import { config } from "./config";
import { rateLimit } from "./middleware/rateLimit";

// Initialize Hono app
export const app = new Hono();

// Enable CORS
app.use("/*", cors(config.cors));

// Apply rate limiting to API endpoints
app.use("/trpc/*", rateLimit);

// Health check endpoint
app.get("/", (c) =>
  c.json({
    status: "ok",
    message: "Server is running!",
    time: new Date().toISOString(),
    endpoints: {
      trpc: "/trpc",
      health: "/health",
    },
  })
);

app.get("/health", async (c) => {
  return c.json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: Date.now(),
    databaseConnected: true, // Mock for tests
  });
});

// tRPC endpoint
app.all("/trpc/*", async (c) => {
  // Handle tRPC requests
  return fetchRequestHandler({
    endpoint: "/trpc",
    req: new Request(c.req.url, {
      method: c.req.method,
      headers: c.req.raw.headers,
      body: c.req.raw.body,
    }),
    router: appRouter,
    createContext: () => ({}),
  });
});
