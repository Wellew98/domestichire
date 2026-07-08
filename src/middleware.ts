import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Simple in-memory rate limiter
const rateMap = new Map<string, { count: number; resetAt: number }>();

function rateLimit(ip: string, limit = 60, windowMs = 60000): boolean {
  const now = Date.now();
  const entry = rateMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateMap.set(ip, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (entry.count >= limit) return false;

  entry.count++;
  return true;
}

export function middleware(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";
  const path = request.nextUrl.pathname;

  // Only rate-limit API routes and auth endpoints
  const rateLimited = path.startsWith("/api/") || path.startsWith("/auth/");

  if (rateLimited && !rateLimit(ip)) {
    return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*", "/auth/:path*"],
};
