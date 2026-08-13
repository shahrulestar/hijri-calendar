import { GithubIcon, InformationCircleIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { CopyButton } from "@/components/copy-button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from "@/components/ui/item"
import { MCP_PUBLIC_URL } from "@/lib/mcp/config"

const TOOLS = [
  {
    name: "get_lunar_months",
    description:
      "Look up Hijri months, or find which month covers a Gregorian date.",
  },
  {
    name: "get_islamic_events",
    description:
      "Look up important Islamic dates and observances in Malaysia.",
  },
] as const

const JAKIM_URL =
  "https://www.e-solat.gov.my/index.php?siteId=24&pageId=26"

export default function Page() {
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
    <main className="mx-auto flex min-h-svh w-full max-w-[1000px] flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
      <header className="flex flex-col gap-3">
        <h1 className="text-2xl font-medium tracking-tight sm:text-3xl">
          Islamic Calendar MCP
        </h1>
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          A remote MCP server for the Malaysian Islamic (Hijri) calendar. Connect
          Cursor, Claude, Figma, or other AI clients to look up Hijri months,
          Gregorian dates, and important Islamic observances.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Connect</CardTitle>
          <CardDescription>
            Use this URL in Cursor, Figma, Claude, or any Streamable HTTP MCP
            client.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <InputGroup>
            <InputGroupInput
              readOnly
              value={MCP_PUBLIC_URL}
              aria-label="Remote MCP URL"
            />
            <InputGroupAddon align="inline-end">
              <CopyButton value={MCP_PUBLIC_URL} />
            </InputGroupAddon>
          </InputGroup>

          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium">Cursor config</p>
            <InputGroup className="h-auto items-start">
              <pre className="min-w-0 flex-1 overflow-x-auto px-3 py-2 font-mono text-xs leading-relaxed">
                {cursorConfig}
              </pre>
              <InputGroupAddon align="inline-end">
                <CopyButton value={cursorConfig} />
              </InputGroupAddon>
            </InputGroup>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tools</CardTitle>
          <CardDescription>
            What AI clients can ask this server.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ItemGroup>
            {TOOLS.map((tool) => (
              <Item key={tool.name} variant="outline" size="sm">
                <ItemContent>
                  <ItemTitle>
                    <code className="font-mono">{tool.name}</code>
                  </ItemTitle>
                  <ItemDescription>{tool.description}</ItemDescription>
                </ItemContent>
              </Item>
            ))}
          </ItemGroup>
        </CardContent>
      </Card>

      <Alert>
        <HugeiconsIcon icon={InformationCircleIcon} />
        <AlertTitle>Data source</AlertTitle>
        <AlertDescription>
          Calendar data follows Malaysia time (Asia/Kuala_Lumpur) and is verified
          against{" "}
          <a href={JAKIM_URL} target="_blank" rel="noreferrer">
            JAKIM e-Solat
          </a>
          . Some later dates may still change after official moon-sighting
          announcements.
        </AlertDescription>
        <div className="col-start-2 mt-2">
          <Button
            variant="outline"
            size="sm"
            nativeButton={false}
            render={
              <a
                href="https://github.com/shahrulestar/islamic-calendar-mcp"
                target="_blank"
                rel="noreferrer"
              />
            }
          >
            <HugeiconsIcon icon={GithubIcon} data-icon="inline-start" />
            GitHub
          </Button>
        </div>
      </Alert>
    </main>
  )
}
