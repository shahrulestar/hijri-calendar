import { GithubIcon, HeartIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { CopyButton } from "@/components/copy-button"
import { Button } from "@/components/ui/button"
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
      "Month summary: Hijri month start, end, and length. Use for “when is Ramadan?” or which month covers a Gregorian date.",
  },
  {
    name: "get_hijri_calendar",
    description:
      "Day-by-day takwim: Hijri date and weekday for one day, a Hijri month, or a short Gregorian range.",
  },
  {
    name: "get_islamic_events",
    description:
      "Important Islamic dates in Malaysia — Aidilfitri, Aidiladha, Maulid, Awal Ramadan, and other observances.",
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
        <h1 className="font-heading scroll-m-20 text-2xl font-medium tracking-tight text-balance">
          Hijri Calendar MCP
        </h1>
        <p className="text-sm text-muted-foreground">
          MCP Server for Malaysia's Islamic calendar.
        </p>
      </header>

      <section className="flex w-full min-w-0 flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="font-heading scroll-m-20 text-xl font-medium tracking-tight">
            Connect
          </h2>
          <p className="text-sm text-muted-foreground">
            Use this URL in Cursor, Figma, Claude, or any Streamable HTTP MCP
            client.
          </p>
        </div>

        <InputGroup className="w-full min-w-0">
          <InputGroupInput
            readOnly
            value={MCP_PUBLIC_URL}
            aria-label="Remote MCP URL"
            className="min-w-0 overflow-x-auto text-sm whitespace-nowrap"
          />
          <InputGroupAddon align="inline-end" className="shrink-0">
            <CopyButton value={MCP_PUBLIC_URL} />
          </InputGroupAddon>
        </InputGroup>

        <div className="flex min-w-0 flex-col gap-2">
          <p className="text-sm font-medium">Cursor config</p>
          <InputGroup className="relative h-auto w-full min-w-0">
            <pre className="min-w-0 flex-1 overflow-x-auto px-3 py-2 pr-10 font-mono text-sm leading-relaxed whitespace-pre">
              {cursorConfig}
            </pre>
            <InputGroupAddon
              align="inline-end"
              className="absolute top-0 right-0 z-10"
            >
              <CopyButton value={cursorConfig} />
            </InputGroupAddon>
          </InputGroup>
        </div>
      </section>

      <section className="flex w-full min-w-0 flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="font-heading scroll-m-20 text-xl font-medium tracking-tight">
            Tools
          </h2>
          <p className="text-sm text-muted-foreground">
            Month summary, day-by-day takwim, and Islamic observances.
          </p>
        </div>
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
      </section>

      <section className="flex w-full flex-col gap-4">
        <div className="flex flex-col gap-2">
          <h2 className="font-heading scroll-m-20 text-xl font-medium tracking-tight">
            Data source
          </h2>
          <p className="text-sm text-muted-foreground">
            Calendar data follows Malaysia time (Asia/Kuala_Lumpur) for 1447H–1450H
            (Gregorian 2025–2028; 1450H through Sha’ban). Verified against{" "}
            <a
              href={JAKIM_URL}
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-3 hover:text-foreground"
            >
              JAKIM e-Solat
            </a>
            .
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            nativeButton={false}
            className="no-underline"
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
          <Button
            variant="outline"
            size="sm"
            nativeButton={false}
            className="no-underline"
            render={
              <a
                href="https://github.com/sponsors/shahrulestar"
                target="_blank"
                rel="noreferrer"
              />
            }
          >
            <HugeiconsIcon icon={HeartIcon} data-icon="inline-start" />
            Sponsor
          </Button>
        </div>
      </section>
    </main>
  )
}
