import { PrismaClient } from "../generated/prisma";

/**
 * Global instance of PrismaClient to avoid multiple connections in development
 */
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Create a singleton PrismaClient instance
export const prisma =
  global.prisma ||
  new PrismaClient({
    log: ["error", "warn"],
  });

// Store the instance on the global object in development to prevent duplicates
if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}

// Track if we're connected to the database
let isConnected = false;

/**
 * Connect to the database and return the prisma client
 */
export async function connectDb() {
  try {
    if (!isConnected) {
      await prisma.$connect();
      isConnected = true;
      console.log("Connected to database");
    }

    // Test the connection with a simple query
    await prisma.$queryRaw`SELECT 1`;

    return prisma;
  } catch (error) {
    console.error("Failed to connect to database:", error);
    isConnected = false;
    throw error;
  }
}

/**
 * Disconnect from the database
 */
export async function disconnectDb() {
  try {
    if (isConnected) {
      await prisma.$disconnect();
      isConnected = false;
      console.log("Disconnected from database");
    }
  } catch (error) {
    console.error("Error disconnecting from database:", error);
    throw error;
  }
}

/**
 * Check if the database is connected
 */
export async function checkDbConnection(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    return false;
  }
}
