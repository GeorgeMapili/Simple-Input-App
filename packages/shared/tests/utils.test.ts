import { describe, it, expect } from "vitest";
import { formatDate, truncateText } from "../src/utils";

describe("utils", () => {
  describe("formatDate", () => {
    it("should format a Date object correctly", () => {
      // Create a specific date for testing
      const testDate = new Date("2023-01-15T12:30:45");
      const formatted = formatDate(testDate);

      // The exact format might differ based on the user's locale,
      // so we'll just check if it contains the expected parts
      expect(formatted).toContain("2023");
      expect(formatted).toContain("Jan");
      expect(formatted).toContain("15");
    });

    it("should handle string dates", () => {
      const testDateString = "2023-01-15T12:30:45";
      const formatted = formatDate(testDateString);

      expect(formatted).toContain("2023");
      expect(formatted).toContain("Jan");
      expect(formatted).toContain("15");
    });
  });

  describe("truncateText", () => {
    it("should not truncate text shorter than maxLength", () => {
      const shortText = "Hello, world!";
      expect(truncateText(shortText, 20)).toBe(shortText);
    });

    it("should truncate text longer than maxLength and add ellipsis", () => {
      const longText = "This is a very long text that should be truncated";
      const truncated = truncateText(longText, 20);

      expect(truncated.length).toBe(22); // 19 chars after trim + 3 for ellipsis
      expect(truncated).toBe("This is a very long...");
    });

    it("should use default maxLength of 100 if not specified", () => {
      const veryLongText = "a".repeat(150);
      const truncated = truncateText(veryLongText);

      expect(truncated.length).toBe(103); // 100 chars + 3 for ellipsis
      expect(truncated).toBe("a".repeat(100) + "...");
    });
  });
});
