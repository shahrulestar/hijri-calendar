# Islamic Calendar MCP

Cloudflare Worker MCP server for the JAKIM Hijri calendar (1447H–1449H), plus a local Next.js app for development UI.

## Remote MCP URL

```text
https://islam-calendar.shahrulestar.com/mcp
```

## Worker (production)

```bash
npm install
npm run worker:dev      # http://127.0.0.1:8788/mcp
npm run worker:deploy   # deploy + custom domain
```

Config: [`wrangler.jsonc`](wrangler.jsonc) — Worker `islamic-calendar-mcp` on custom domain `islam-calendar.shahrulestar.com`.

## Next.js (local UI + /api/mcp)

```bash
npm run dev
```

Local Next MCP: `http://localhost:3000/api/mcp`

## Data

| File | Content |
|------|---------|
| [`data/hijri_months.json`](data/hijri_months.json) | Lunar month start/end (1447H–1449H) |
| [`data/islamic_events.json`](data/islamic_events.json) | Islamic calendar events (1448H–1449H) |

## MCP tools

| Tool | Description | Parameters |
|------|-------------|------------|
| `get_lunar_months` | Lunar month details (list, one month, or date lookup) | `year?`, `month?`, `status?`, `date?` |
| `get_islamic_events` | Islamic calendar events for Malaysia | `year?`, `month?`, `type?`, `date?`, `includeRecurring?` |

## Cursor setup

```json
{
  "mcpServers": {
    "islamic-calendar": {
      "url": "https://islam-calendar.shahrulestar.com/mcp"
    }
  }
}
```

Local Worker:

```json
{
  "mcpServers": {
    "islamic-calendar": {
      "url": "http://127.0.0.1:8788/mcp"
    }
  }
}
```

Stdio proxy clients:

```json
{
  "mcpServers": {
    "islamic-calendar": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "https://islam-calendar.shahrulestar.com/mcp"]
    }
  }
}
```
