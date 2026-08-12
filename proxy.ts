import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

import { MCP_PATH, MCP_RATE_LIMIT } from "@/lib/mcp/config"

interface RateBucket {
  count: number
  resetAt: number
}

const buckets = new Map<string, RateBucket>()
const WINDOW_MS = 60_000

function getClientIp(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  )
}

function isRateLimited(ip: string): { limited: boolean; retryAfter: number } {
  const limit =
    Number.isFinite(MCP_RATE_LIMIT) && MCP_RATE_LIMIT > 0 ? MCP_RATE_LIMIT : 60
  const now = Date.now()
  const existing = buckets.get(ip)

  if (!existing || existing.resetAt <= now) {
    buckets.set(ip, { count: 1, resetAt: now + WINDOW_MS })
    return { limited: false, retryAfter: 0 }
  }

  if (existing.count >= limit) {
    return {
      limited: true,
      retryAfter: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)),
    }
  }

  existing.count += 1
  return { limited: false, retryAfter: 0 }
}

function applySecurityHeaders(response: NextResponse, pathname: string) {
  response.headers.set("X-Content-Type-Options", "nosniff")
  response.headers.set("X-Frame-Options", "DENY")
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()",
  )
  response.headers.set("X-Robots-Tag", "noindex, nofollow")

  if (pathname === MCP_PATH || pathname.startsWith(`${MCP_PATH}/`)) {
    response.headers.set("Cache-Control", "no-store")
  }

  return response
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname === MCP_PATH || pathname.startsWith(`${MCP_PATH}/`)) {
    const ip = getClientIp(request)
    const { limited, retryAfter } = isRateLimited(ip)

    if (limited) {
      const response = NextResponse.json(
        { error: "Too Many Requests" },
        { status: 429 },
      )
      response.headers.set("Retry-After", String(retryAfter))
      return applySecurityHeaders(response, pathname)
    }
  }

  return applySecurityHeaders(NextResponse.next(), pathname)
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
