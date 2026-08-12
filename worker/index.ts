import { createMcpHandler } from "agents/mcp/server"
import { createServer } from "./server"

const handler = createMcpHandler(createServer, {
  route: "/mcp",
  allowedHostnames: [
    "islam-calendar.shahrulestar.com",
    "localhost",
    "127.0.0.1",
  ],
})

export default {
  fetch(request: Request, env: Env, ctx: ExecutionContext) {
    const url = new URL(request.url)

    if (url.pathname === "/" || url.pathname === "/health") {
      return Response.json({
        name: "islamic-calendar",
        mcp: "/mcp",
        status: "ok",
      })
    }

    return handler(request, env, ctx)
  },
} satisfies ExportedHandler<Env>
