# Islamic Calendar MCP

A remote MCP server for the Malaysian Islamic (Hijri) calendar.

It helps AI tools look up Hijri months, Gregorian dates, and important Islamic dates in Malaysia — such as Awal Ramadan, Aidilfitri, Aidiladha, Maal Hijrah, and Maulidur Rasul.

## Connect

```text
https://islam-calendar.shahrulestar.com/mcp
```

## What it covers

- Hijri lunar months (1447H–1449H)
- Important Islamic dates and observances in Malaysia
- Matching Hijri and Gregorian (Miladi) dates

## Tools

| Tool | What it does |
|------|----------------|
| `get_lunar_months` | Look up Hijri months, or find which month covers a Gregorian date |
| `get_islamic_events` | Look up important Islamic dates and observances in Malaysia |

## Data source

Calendar data is verified against JAKIM’s official Islamic calendar (e-Solat):

[JAKIM Islamic Calendar](https://www.e-solat.gov.my/index.php?siteId=24&pageId=26)

Some dates marked by JAKIM may still depend on official moon-sighting announcements.
