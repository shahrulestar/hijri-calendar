export const MCP_PATH = "/mcp"

export const MCP_PUBLIC_URL =
  process.env.NEXT_PUBLIC_MCP_URL ??
  "https://hijri.shahrulestar.com/mcp"

export const MCP_API_KEY = process.env.MCP_API_KEY?.trim() || undefined

export const MCP_RATE_LIMIT = Number.parseInt(
  process.env.MCP_RATE_LIMIT ?? "60",
  10,
)

export const MCP_SERVER_INFO = {
  name: "islamic-calendar-mcp",
  version: "0.1.0",
} as const
