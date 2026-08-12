import type { McpServer } from "@modelcontextprotocol/server"
import { z } from "zod"

import {
  formatJson,
  getMonth,
  listMonths,
  lookupDate,
} from "@/lib/hijri/calendar"
import { listEvents, listRecurringEvents } from "@/lib/hijri/events"

export function registerTools(server: McpServer) {
  server.registerTool(
    "get_lunar_months",
    {
      title: "Get Lunar Months",
      description:
        "Get Hijri (lunar) month details from the JAKIM calendar (1447H–1449H). Filter by year, month, or status. Pass date (YYYY-MM-DD) to resolve which lunar month covers that Gregorian day.",
      inputSchema: z.object({
        year: z
          .number()
          .int()
          .min(1447)
          .max(1449)
          .optional()
          .describe("Hijri year (1447–1449)"),
        month: z
          .number()
          .int()
          .min(1)
          .max(12)
          .optional()
          .describe("Hijri month order (1–12)"),
        status: z
          .enum(["confirmed", "estimated"])
          .optional()
          .describe("Month confirmation status"),
        date: z
          .string()
          .regex(/^\d{4}-\d{2}-\d{2}$/)
          .optional()
          .describe(
            "Gregorian ISO date (YYYY-MM-DD). Returns covering month and day-of-month.",
          ),
      }),
    },
    async ({ year, month, status, date }) => {
      if (date !== undefined) {
        const result = lookupDate(date)
        if (!result) {
          return {
            content: [
              {
                type: "text",
                text: `No Hijri month covers ${date}. Data covers 1447H–1449H only.`,
              },
            ],
            isError: true,
          }
        }
        return { content: [{ type: "text", text: formatJson(result) }] }
      }

      if (year !== undefined && month !== undefined) {
        const entry = getMonth(year, month)
        if (!entry) {
          return {
            content: [
              {
                type: "text",
                text: `No month found for ${year}H month ${month}.`,
              },
            ],
            isError: true,
          }
        }
        return { content: [{ type: "text", text: formatJson(entry) }] }
      }

      return {
        content: [
          {
            type: "text",
            text: formatJson(listMonths({ year, status })),
          },
        ],
      }
    },
  )

  server.registerTool(
    "get_islamic_events",
    {
      title: "Get Islamic Events",
      description:
        "Get important Islamic calendar events for Malaysia (1448H–1449H). Filter by year, month, type, or Gregorian date. Set includeRecurring to include monthly recurring events.",
      inputSchema: z.object({
        year: z
          .number()
          .int()
          .min(1448)
          .max(1449)
          .optional()
          .describe("Hijri year (1448–1449)"),
        month: z
          .number()
          .int()
          .min(1)
          .max(12)
          .optional()
          .describe("Hijri month order (1–12)"),
        type: z
          .enum(["public_holiday", "ritual", "voluntary", "historical"])
          .optional()
          .describe("Event type"),
        date: z
          .string()
          .regex(/^\d{4}-\d{2}-\d{2}$/)
          .optional()
          .describe("Gregorian ISO date (YYYY-MM-DD)"),
        includeRecurring: z
          .boolean()
          .optional()
          .describe("Include monthly recurring events (default false)"),
      }),
    },
    async ({ year, month, type, date, includeRecurring }) => {
      const payload: {
        events: ReturnType<typeof listEvents>
        recurring?: ReturnType<typeof listRecurringEvents>
      } = {
        events: listEvents({ year, month, type, date }),
      }

      if (includeRecurring) {
        payload.recurring = listRecurringEvents()
      }

      return {
        content: [{ type: "text", text: formatJson(payload) }],
      }
    },
  )
}
