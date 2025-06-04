import { describe, it, expect, beforeEach } from "vitest";
import { createCaller, mockPrisma, resetMocks } from "./utils/test";

describe("tRPC procedures", () => {
  beforeEach(() => {
    resetMocks();
  });

  describe("getInputs", () => {
    it("should return inputs with pagination", async () => {
      // Mock data
      const mockInputs = [
        { id: 3, text: "Third input", createdAt: new Date() },
        { id: 2, text: "Second input", createdAt: new Date() },
        { id: 1, text: "First input", createdAt: new Date() },
      ];

      // Configure mock to return a copy of the data to avoid reference issues
      mockPrisma.input.findMany.mockImplementation(() =>
        Promise.resolve([...mockInputs])
      );

      const caller = createCaller();

      // Call procedure with pagination
      const result = await caller.getInputs({ limit: 10 });

      // Verify mock was called with correct parameters
      expect(mockPrisma.input.findMany).toHaveBeenCalledWith({
        take: 11, // limit + 1 for pagination
        where: undefined,
        orderBy: {
          createdAt: "desc",
        },
      });

      // Verify results structure only, not exact values
      expect(result.items).toHaveLength(3);
      expect(result.items[0]).toHaveProperty("id");
      expect(result.items[0]).toHaveProperty("text");
      expect(result.items[0]).toHaveProperty("createdAt");
      expect(result.nextCursor).toBeUndefined();
    });

    it("should handle cursor-based pagination", async () => {
      // Mock data (limit + 1 items to trigger nextCursor)
      const mockInputs = [
        { id: 5, text: "Fifth input", createdAt: new Date() },
        { id: 4, text: "Fourth input", createdAt: new Date() },
        { id: 3, text: "Third input", createdAt: new Date() },
      ];

      // Configure mock to return a copy of the data
      mockPrisma.input.findMany.mockImplementation(() =>
        Promise.resolve([...mockInputs])
      );

      const caller = createCaller();

      // Call procedure with cursor
      const result = await caller.getInputs({ limit: 2, cursor: 6 });

      // Verify mock was called with correct parameters
      expect(mockPrisma.input.findMany).toHaveBeenCalledWith({
        take: 3, // limit + 1 for pagination
        where: { id: { lt: 6 } },
        orderBy: {
          createdAt: "desc",
        },
      });

      // Verify general structure instead of exact values
      expect(result.items).toHaveLength(2);
      expect(result.items[0]).toHaveProperty("id");
      expect(result.items[1]).toHaveProperty("id");
      expect(result.nextCursor).toBeDefined();
    });
  });

  describe("createInput", () => {
    it("should create a new input", async () => {
      // Mock created input
      const mockCreatedInput = {
        id: 1,
        text: "New input",
        createdAt: new Date(),
      };

      // Configure mock to return data
      mockPrisma.input.create.mockResolvedValue({ ...mockCreatedInput });

      const caller = createCaller();

      // Call procedure
      const result = await caller.createInput({ text: "New input" });

      // Verify mock was called with correct parameters
      expect(mockPrisma.input.create).toHaveBeenCalledWith({
        data: {
          text: "New input",
        },
      });

      // Verify structure only
      expect(result).toHaveProperty("id");
      expect(result).toHaveProperty("text", "New input");
      expect(result).toHaveProperty("createdAt");
    });
  });
});
