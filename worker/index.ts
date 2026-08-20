import { createMcpHandler } from "agents/mcp/server"

import { ICON_DARK_SVG, ICON_LIGHT_SVG } from "../lib/favicon"
import {
  buildIslamicEventsIcs,
  icsFilename,
  parseIcsSearchParams,
} from "../lib/hijri/ics"
import { LANDING_HTML } from "./landing"
import { createServer } from "./server"

const handler = createMcpHandler(createServer, {
  route: "/mcp",
  allowedHostnames: [
    "hijri.shahrulestar.com",
    "localhost",
    "127.0.0.1",
  ],
})

const NOINDEX = { "X-Robots-Tag": "noindex, nofollow" }

export default {
  fetch(request: Request, env: Env, ctx: ExecutionContext) {
    const url = new URL(request.url)

    if (url.pathname === "/icon-light.svg") {
      return new Response(ICON_LIGHT_SVG, {
        headers: {
          "Content-Type": "image/svg+xml; charset=utf-8",
          "Cache-Control": "public, max-age=86400",
          ...NOINDEX,
        },
      })
    }

    if (url.pathname === "/icon-dark.svg") {
      return new Response(ICON_DARK_SVG, {
        headers: {
          "Content-Type": "image/svg+xml; charset=utf-8",
          "Cache-Control": "public, max-age=86400",
          ...NOINDEX,
        },
      })
    }

    if (url.pathname === "/") {
      return new Response(LANDING_HTML, {
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          "Cache-Control": "public, max-age=300",
          ...NOINDEX,
        },
      })
    }

    if (url.pathname === "/health") {
      return Response.json(
        {
          name: "islamic-calendar",
          mcp: "/mcp",
          status: "ok",
        },
        { headers: NOINDEX },
      )
    }

    if (url.pathname === "/calendar/islamic-events.ics") {
      if (request.method !== "GET" && request.method !== "HEAD") {
        return new Response("Method Not Allowed", {
          status: 405,
          headers: { Allow: "GET, HEAD", ...NOINDEX },
        })
      }

      const options = parseIcsSearchParams(url.searchParams)
      if ("error" in options) {
        return new Response(options.error, {
          status: 400,
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
            ...NOINDEX,
          },
        })
      }

      const body = buildIslamicEventsIcs(options)
      return new Response(request.method === "HEAD" ? null : body, {
        headers: {
          "Content-Type": "text/calendar; charset=utf-8",
          "Content-Disposition": `attachment; filename="${icsFilename(options)}"`,
          "Cache-Control": "public, max-age=3600",
          ...NOINDEX,
        },
      })
    }

    return handler(request, env, ctx)
  },
} satisfies ExportedHandler<Env>
