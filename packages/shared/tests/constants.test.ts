import { describe, it, expect } from "vitest";
import { INPUT_CONSTRAINTS, API_ENDPOINTS, TIME } from "../src/constants";

describe("constants", () => {
  describe("INPUT_CONSTRAINTS", () => {
    it("should define correct input constraints", () => {
      expect(INPUT_CONSTRAINTS).toHaveProperty("MIN_LENGTH");
      expect(INPUT_CONSTRAINTS).toHaveProperty("MAX_LENGTH");

      expect(INPUT_CONSTRAINTS.MIN_LENGTH).toBe(1);
      expect(INPUT_CONSTRAINTS.MAX_LENGTH).toBe(255);
    });
  });

  describe("API_ENDPOINTS", () => {
    it("should define correct API endpoints", () => {
      expect(API_ENDPOINTS).toHaveProperty("BASE_URL");
      expect(API_ENDPOINTS).toHaveProperty("INPUTS");

      // Check that endpoints are properly formatted strings
      expect(typeof API_ENDPOINTS.BASE_URL).toBe("string");
      expect(typeof API_ENDPOINTS.INPUTS).toBe("string");
    });
  });

  describe("TIME", () => {
    it("should define correct time constants", () => {
      expect(TIME).toHaveProperty("REQUEST_TIMEOUT");
      expect(TIME).toHaveProperty("STALE_TIME");

      expect(TIME.REQUEST_TIMEOUT).toBe(5000);
      expect(TIME.STALE_TIME).toBe(60 * 1000);
    });
  });
});
