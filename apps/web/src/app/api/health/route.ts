import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const timestamp = new Date();
  let dbHealthy = false;
  let cacheHealthy = true; // Placeholder
  let externalHealthy = true; // Placeholder

  try {
    // Check database connection
    await db.$queryRaw`SELECT 1`;
    dbHealthy = true;
  } catch (err) {
    console.error("Database health check failed:", err);
  }

  const status = dbHealthy && cacheHealthy && externalHealthy
    ? "healthy"
    : dbHealthy
    ? "degraded"
    : "unhealthy";

  const response = {
    status,
    timestamp,
    services: {
      database: dbHealthy,
      cache: cacheHealthy,
      external: externalHealthy,
    },
    version: process.env.APP_VERSION || "1.0.0",
  };

  return NextResponse.json(response, {
    status: status === "healthy" ? 200 : 503,
  });
}
