import { appRouter } from "../trpc";
import { describe, expect, it, vi } from "vitest";
import { PrismaClient } from "@prisma/client";

// Create a mockPrisma for testing without actual database connections
export const mockPrisma = {
  input: {
    findMany: vi.fn(),
    create: vi.fn(),
    count: vi.fn(),
  },
  $connect: vi.fn(),
  $disconnect: vi.fn(),
} as unknown as PrismaClient;

// Create a test context for tRPC procedures
export function createTestContext() {
  return {
    prisma: mockPrisma,
  };
}

// Helper to call tRPC procedures in tests
export function createCaller() {
  const ctx = createTestContext();
  return appRouter.createCaller(ctx);
}

// Reset all mocks between tests
export function resetMocks() {
  vi.resetAllMocks();
}
