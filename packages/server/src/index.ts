import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "./trpc";
import { config } from "./config";
import { connectDb, disconnectDb, checkDbConnection } from "./db";
import { rateLimit } from "./middleware/rateLimit";

// Initialize Hono app
const app = new Hono();

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
  const isDbConnected = await checkDbConnection();

  return c.json({
    status: isDbConnected ? "ok" : "error",
    uptime: process.uptime(),
    timestamp: Date.now(),
    databaseConnected: isDbConnected,
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

// Start the server
console.log(
  `Server is starting on http://${config.server.host}:${config.server.port}`
);

// Connect to the database before starting the server
async function main() {
  try {
    await connectDb();

    serve({
      fetch: app.fetch,
      port: config.server.port,
      hostname: config.server.host,
    });

    console.log(
      `Server is running on http://${config.server.host}:${config.server.port}`
    );

    // Handle graceful shutdown
    process.on("SIGTERM", async () => {
      console.log("Shutting down server...");
      await disconnectDb();
      process.exit(0);
    });

    process.on("SIGINT", async () => {
      console.log("Shutting down server...");
      await disconnectDb();
      process.exit(0);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    await disconnectDb();
    process.exit(1);
  }
}

main();
