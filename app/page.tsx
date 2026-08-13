import { headers } from "next/headers"

import { CopyButton } from "@/components/copy-button"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { MCP_PUBLIC_URL } from "@/lib/mcp/config"
import { getPublicMcpUrl } from "@/lib/mcp/public-url"

const TOOLS = [
  {
    name: "get_lunar_months",
    description:
      "Lunar month details (list, one month, or Gregorian date lookup). Includes Hijri and Gregorian dates.",
    params: "year?, month?, date?, calendar?",
  },
  {
    name: "get_islamic_events",
    description:
      "Islamic calendar events for Malaysia (1448H–1449H). Includes Hijri and Gregorian dates.",
    params: "year?, month?, type?, date?, includeRecurring?, calendar?",
  },
] as const

export default async function Page() {
  const headerStore = await headers()
  const host = headerStore.get("x-forwarded-host") ?? headerStore.get("host")
  const proto =
    headerStore.get("x-forwarded-proto") ??
    (host?.includes("localhost") ? "http" : "https")
  const origin = host ? `${proto}://${host}` : undefined
  const mcpUrl = getPublicMcpUrl(origin)
  const cursorConfig = JSON.stringify(
    {
      mcpServers: {
        "islamic-calendar": {
          url: MCP_PUBLIC_URL,
        },
      },
    },
    null,
    2,
  )

  return (
    <main className="mx-auto flex min-h-svh w-full max-w-2xl flex-col gap-6 p-6">
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-2xl font-medium tracking-tight">
            Islamic Calendar MCP
          </h1>
          <Badge variant="secondary">Remote MCP</Badge>
        </div>
        <p className="text-sm leading-relaxed text-muted-foreground">
          A Model Context Protocol server for the JAKIM Hijri calendar
          (1447H–1449H). Connect Cursor, Claude, or other MCP clients to look up
          Hijri months and Gregorian date mappings.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Remote MCP URL</CardTitle>
          <CardDescription>
            Official production endpoint for Streamable HTTP clients.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <code className="min-w-0 flex-1 truncate rounded-md bg-muted px-3 py-2 font-mono text-xs">
              {MCP_PUBLIC_URL}
            </code>
            <CopyButton value={MCP_PUBLIC_URL} />
          </div>
          {mcpUrl !== MCP_PUBLIC_URL ? (
            <p className="text-xs text-muted-foreground">
              Local development endpoint:{" "}
              <code className="font-mono">{mcpUrl}</code>
            </p>
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tools</CardTitle>
          <CardDescription>
            Calendar data sourced from JAKIM. Months may be{" "}
            <code className="font-mono">confirmed</code> or{" "}
            <code className="font-mono">estimated</code>.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3">
            {TOOLS.map((tool) => (
              <div
                key={tool.name}
                className="flex flex-col gap-1 rounded-lg border border-border p-3"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <code className="font-mono text-sm font-medium">
                    {tool.name}
                  </code>
                  <Badge variant="outline">{tool.params}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {tool.description}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Cursor config</CardTitle>
          <CardDescription>
            Add this to <code className="font-mono">.cursor/mcp.json</code>.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <pre className="overflow-x-auto rounded-md bg-muted p-3 font-mono text-xs leading-relaxed">
            {cursorConfig}
          </pre>
          <CopyButton value={cursorConfig} />
        </CardContent>
      </Card>
    </main>
  )
}
