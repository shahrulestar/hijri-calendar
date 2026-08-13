import { createMcpHandler } from "agents/mcp/server"

import { LANDING_HTML } from "./landing"
import { createServer } from "./server"

const handler = createMcpHandler(createServer, {
  route: "/mcp",
  allowedHostnames: [
    "islam-calendar.shahrulestar.com",
    "localhost",
    "127.0.0.1",
  ],
})

const NOINDEX = { "X-Robots-Tag": "noindex, nofollow" }

export default {
  fetch(request: Request, env: Env, ctx: ExecutionContext) {
    const url = new URL(request.url)

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

    return handler(request, env, ctx)
  },
} satisfies ExportedHandler<Env>
