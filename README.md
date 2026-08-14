# Islamic Calendar MCP

A remote MCP server for the Malaysian Islamic (Hijri) calendar.

It helps AI tools look up Hijri months, Gregorian dates, and important Islamic dates in Malaysia — such as Awal Ramadan, Aidilfitri, Aidiladha, Maal Hijrah, and Maulidur Rasul.

## Connect

```text
https://islam-calendar.shahrulestar.com/mcp
```

## What it covers

- Hijri lunar months (1447H–1449H)
- Day-by-day Hijri takwim (1447H–1449H)
- Important Islamic dates and observances in Malaysia
- Matching Hijri and Gregorian (Miladi) dates

## Tools

| Tool | What it does |
|------|----------------|
| `get_lunar_months` | **Month summary.** Start, end, and length of each Hijri month. Use for “when is Ramadan?” or which month covers a Gregorian date. |
| `get_hijri_calendar` | **Day-by-day takwim.** Hijri date and weekday for one day, a Hijri month, or a short Gregorian range. |
| `get_islamic_events` | **Observances in Malaysia.** Aidilfitri, Aidiladha, Maulid, Awal Ramadan, and other important Islamic dates. |

## Data source

Calendar data follows Malaysia timezone (`Asia/Kuala_Lumpur`) and is verified against JAKIM’s official Islamic calendar (e-Solat):

[JAKIM Islamic Calendar](https://www.e-solat.gov.my/index.php?siteId=24&pageId=26)

Confirmed JAKIM dates are used as-is. Official JAKIM takwim days (2026–2027) are `estimated=false`. Later dates are estimated from the lunar month table and may change after official moon-sighting announcements — this server never advances an event earlier than its Hijri day on that table.
