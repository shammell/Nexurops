import { PrismaClient } from "@prisma/client";

// ---------------------------------------------------------------------------
// Prisma Client Singleton for Next.js
// ---------------------------------------------------------------------------
// Next.js hot-reloads in development, creating new PrismaClient instances on
// every reload. This singleton prevents exhausting the database connection
// pool by reusing the same client across hot reloads.
//
// In production, module-level caching is sufficient (no hot reload).
// ---------------------------------------------------------------------------

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}

// Alias: import { prisma } from "@/lib/db" or import { db } from "@/lib/db"
export const prisma = db;
export type { PrismaClient };
export default db;
