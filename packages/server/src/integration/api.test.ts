import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import { serve } from "@hono/node-server";
import { app } from "../app";
import { AddressInfo } from "net";

// Skip integration tests for now as they require database setup
describe.skip("API Integration Tests", () => {
  let server: ReturnType<typeof serve>;

  beforeAll(() => {
    // Setup a test server
    server = serve({
      fetch: app.fetch,
      port: 0, // Use a random port
    });
  });

  afterAll(() => {
    // Close the server
    server.close();
  });

  // Helper to get the server URL
  const getServerUrl = () => {
    const addressInfo = server.address() as AddressInfo;
    return `http://localhost:${addressInfo.port}`;
  };

  it("should return empty inputs list", async () => {
    const response = await request(getServerUrl())
      .get("/trpc/getInputs")
      .set("Accept", "application/json");

    expect(response.status).toBe(200);
    expect(response.body.result.data.items).toEqual([]);
  });

  it("should create a new input and retrieve it", async () => {
    // Create a new input
    const inputData = { text: "Integration test input" };

    const createResponse = await request(getServerUrl())
      .post("/trpc/createInput")
      .send({
        input: inputData,
      })
      .set("Accept", "application/json")
      .set("Content-Type", "application/json");

    expect(createResponse.status).toBe(200);
    expect(createResponse.body.result.data.text).toBe("Integration test input");

    // Verify it was added to the database
    const getResponse = await request(getServerUrl())
      .get("/trpc/getInputs")
      .set("Accept", "application/json");

    expect(getResponse.status).toBe(200);
    expect(getResponse.body.result.data.items).toHaveLength(1);
    expect(getResponse.body.result.data.items[0].text).toBe(
      "Integration test input"
    );
  });
});
