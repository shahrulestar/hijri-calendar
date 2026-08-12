import { createMcpHandler, withMcpAuth } from "mcp-handler"

import { isMcpAuthRequired, verifyToken } from "./auth"
import { MCP_PUBLIC_URL, MCP_SERVER_INFO } from "./config"
import { registerTools } from "./tools"

const baseHandler = createMcpHandler(
  (server) => {
    registerTools(server)
  },
  {
    serverInfo: MCP_SERVER_INFO,
    onEvent: (event) => {
      if (event.type === "REQUEST_COMPLETED") {
        console.info(
          `[mcp] ${event.method} ${event.status}${event.duration !== undefined ? ` ${event.duration}ms` : ""}`,
        )
        return
      }

      if (event.type === "ERROR") {
        console.error(`[mcp] ${event.severity}: ${String(event.error)}`)
      }
    },
  },
)

export const mcpHandler = isMcpAuthRequired()
  ? withMcpAuth(baseHandler, verifyToken, {
      required: true,
      resourceUrl: MCP_PUBLIC_URL,
    })
  : baseHandler
