import { Context } from "hono";

// A simple in-memory store for rate limiting
const requestStore: Record<string, { count: number; resetTime: number }> = {};

// Rate limit configuration
const RATE_LIMIT = {
  // Maximum requests per window
  MAX_REQUESTS: 60,
  // Window duration in milliseconds (1 minute)
  WINDOW_MS: 60 * 1000,
};

/**
 * Simple in-memory rate limiting middleware for Hono
 * Limits requests based on IP address
 */
export async function rateLimit(c: Context, next: () => Promise<void>) {
  const ip =
    c.req.header("x-forwarded-for") || c.req.header("x-real-ip") || "unknown";

  const now = Date.now();

  // Initialize or get existing record for this IP
  if (!requestStore[ip] || requestStore[ip].resetTime < now) {
    requestStore[ip] = {
      count: 0,
      resetTime: now + RATE_LIMIT.WINDOW_MS,
    };

    // Clean up old entries periodically
    setTimeout(() => {
      delete requestStore[ip];
    }, RATE_LIMIT.WINDOW_MS);
  }

  // Increment the request count
  requestStore[ip].count++;

  // Check if over limit
  if (requestStore[ip].count > RATE_LIMIT.MAX_REQUESTS) {
    return c.json(
      {
        error: "Too many requests",
        message: "Rate limit exceeded, please try again later",
      },
      429
    );
  }

  // Add rate limit headers
  c.header("X-RateLimit-Limit", RATE_LIMIT.MAX_REQUESTS.toString());
  c.header(
    "X-RateLimit-Remaining",
    Math.max(0, RATE_LIMIT.MAX_REQUESTS - requestStore[ip].count).toString()
  );
  c.header(
    "X-RateLimit-Reset",
    Math.ceil(requestStore[ip].resetTime / 1000).toString()
  );

  await next();
}
