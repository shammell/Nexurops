import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { UserRole } from "@nexurops/types";

// Rate limiting store (in-memory, use Redis in production)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

const RATE_LIMIT = 1000; // requests per hour
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour in ms

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetAt) {
    rateLimitMap.set(ip, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW,
    });
    return true;
  }

  if (record.count >= RATE_LIMIT) {
    return false;
  }

  record.count++;
  return true;
}

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Rate limiting for all API routes
  if (path.startsWith("/api/")) {
    const ip = request.ip || request.headers.get("x-forwarded-for") || "unknown";
    
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Rate limit exceeded" },
        { 
          status: 429,
          headers: {
            "Retry-After": "3600",
          },
        }
      );
    }
  }

  // Skip auth check for public routes
  if (
    path.startsWith("/api/auth") ||
    path.startsWith("/api/webhooks") ||
    path.startsWith("/api/health") ||
    path.startsWith("/_next") ||
    path.startsWith("/public") ||
    path === "/" ||
    path === "/auth/signin" ||
    path === "/auth/signout" ||
    path === "/auth/error"
  ) {
    return NextResponse.next();
  }

  // Protect client and admin routes
  if (path.startsWith("/client") || path.startsWith("/admin")) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token) {
      const url = new URL("/auth/signin", request.url);
      url.searchParams.set("callbackUrl", path);
      return NextResponse.redirect(url);
    }

    // Check admin routes
    if (path.startsWith("/admin")) {
      const role = token.role as UserRole;
      if (role !== UserRole.ADMIN && role !== UserRole.SUPER_ADMIN) {
        return NextResponse.redirect(new URL("/client/dashboard", request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
