import type { AuthInfo } from "@modelcontextprotocol/server"

import { MCP_API_KEY } from "./config"

export function isMcpAuthRequired(): boolean {
  return Boolean(MCP_API_KEY)
}

export async function verifyToken(
  _req: Request,
  bearerToken?: string,
): Promise<AuthInfo | undefined> {
  if (!MCP_API_KEY) return undefined
  if (!bearerToken || bearerToken !== MCP_API_KEY) return undefined

  return {
    token: bearerToken,
    scopes: ["mcp:tools"],
    clientId: "api-key-client",
  }
}
