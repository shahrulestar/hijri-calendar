import { MCP_PATH, MCP_PUBLIC_URL } from "./config"

export function getPublicMcpUrl(origin?: string): string {
  if (process.env.NODE_ENV === "production") return MCP_PUBLIC_URL
  if (process.env.NEXT_PUBLIC_MCP_URL) return process.env.NEXT_PUBLIC_MCP_URL
  return `${origin ?? "http://localhost:3000"}${MCP_PATH}`
}
