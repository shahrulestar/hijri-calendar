import { McpServer } from "@modelcontextprotocol/server"

import { registerTools } from "../lib/mcp/tools"

export function createServer() {
  const server = new McpServer({
    name: "islamic-calendar",
    version: "1.0.0",
  })

  registerTools(server)
  return server
}
