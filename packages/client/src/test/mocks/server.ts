import { setupServer } from "msw/node";
import { handlers } from "./handlers";
import { beforeAll, afterEach, afterAll } from "vitest";

// Set up a mock server using the defined handlers
export const server = setupServer(...handlers);

// Listen for requests when testing
export function setupMswServer() {
  // Start the server before all tests
  beforeAll(() => server.listen({ onUnhandledRequest: "error" }));

  // Reset handlers between tests
  afterEach(() => server.resetHandlers());

  // Clean up after all tests
  afterAll(() => server.close());
}
