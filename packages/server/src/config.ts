/**
 * Application configuration loaded from environment variables
 */
export const config = {
  server: {
    port: Number(process.env.PORT || 3001),
    host: process.env.HOST || "0.0.0.0",
  },
  database: {
    url: process.env.DATABASE_URL || "",
  },
  cors: {
    origin: "*",
    allowMethods: ["GET", "POST", "OPTIONS"],
    allowHeaders: ["Content-Type"],
  },
};
