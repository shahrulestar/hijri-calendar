import type { McpServer } from "@modelcontextprotocol/server"
import { z } from "zod"

import {
  formatJson,
  getMonth,
  listDays,
  listMonths,
  lookupDate,
  orderCalendarFields,
  toDayView,
  toMonthView,
  type CalendarMode,
} from "@/lib/hijri/calendar"
import { listEvents, listRecurringEvents, toEventView } from "@/lib/hijri/events"

const calendarSchema = z
  .enum(["hijri", "gregorian", "both"])
  .optional()
  .describe(
    "Preferred calendar emphasis. Always includes both Hijri and Gregorian. Default: both.",
  )

function resolveCalendar(calendar?: CalendarMode): CalendarMode {
  return calendar ?? "both"
}

export function registerTools(server: McpServer) {
  server.registerTool(
    "get_lunar_months",
    {
      title: "Get Lunar Months",
      description:
        "Get Hijri (lunar) month details from the JAKIM calendar (1447H–1449H). Filter by year or month. Pass date (YYYY-MM-DD) to resolve which lunar month covers that Gregorian day. Responses always include Hijri and Gregorian dates.",
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
        date: z
          .string()
          .regex(/^\d{4}-\d{2}-\d{2}$/)
          .optional()
          .describe(
            "Gregorian ISO date (YYYY-MM-DD). Returns covering month and day-of-month.",
          ),
        calendar: calendarSchema,
      }),
    },
    async ({ year, month, date, calendar }) => {
      const mode = resolveCalendar(calendar)

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

        return {
          content: [
            {
              type: "text",
              text: formatJson({
                ...orderCalendarFields(
                  {
                    hijri: result.hijri,
                    gregorian: result.gregorian,
                    estimated: result.estimated,
                  },
                  mode,
                ),
                month: orderCalendarFields(result.month, mode),
              }),
            },
          ],
        }
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

        return {
          content: [
            {
              type: "text",
              text: formatJson(orderCalendarFields(toMonthView(entry), mode)),
            },
          ],
        }
      }

      return {
        content: [
          {
            type: "text",
            text: formatJson(
              listMonths({ year }).map((entry) =>
                orderCalendarFields(toMonthView(entry), mode),
              ),
            ),
          },
        ],
      }
    },
  )

  server.registerTool(
    "get_hijri_calendar",
    {
      title: "Get Hijri Calendar",
      description:
        "Get day-by-day Malaysian Hijri takwim (1447H–1449H, Asia/Kuala_Lumpur). Requires a filter: a Gregorian date, a Hijri year+month, or a Gregorian from+to range (max 62 days). Days outside the official JAKIM 2026–2027 takwim are estimated=true.",
      inputSchema: z.object({
        date: z
          .string()
          .regex(/^\d{4}-\d{2}-\d{2}$/)
          .optional()
          .describe("Gregorian ISO date (YYYY-MM-DD)"),
        year: z
          .number()
          .int()
          .min(1447)
          .max(1449)
          .optional()
          .describe("Hijri year (requires month)"),
        month: z
          .number()
          .int()
          .min(1)
          .max(12)
          .optional()
          .describe("Hijri month order 1–12 (requires year)"),
        from: z
          .string()
          .regex(/^\d{4}-\d{2}-\d{2}$/)
          .optional()
          .describe("Gregorian range start (requires to, max 62 days)"),
        to: z
          .string()
          .regex(/^\d{4}-\d{2}-\d{2}$/)
          .optional()
          .describe("Gregorian range end (requires from, max 62 days)"),
        calendar: calendarSchema,
      }),
    },
    async ({ date, year, month, from, to, calendar }) => {
      const mode = resolveCalendar(calendar)
      const result = listDays({
        date,
        hijriYear: year,
        month,
        from,
        to,
      })

      if ("error" in result) {
        return {
          content: [{ type: "text", text: result.error }],
          isError: true,
        }
      }

      if (result.length === 0) {
        return {
          content: [
            {
              type: "text",
              text: "No takwim days matched. Data covers 1447H–1449H only.",
            },
          ],
          isError: true,
        }
      }

      return {
        content: [
          {
            type: "text",
            text: formatJson(
              result.map((day) => orderCalendarFields(toDayView(day), mode)),
            ),
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
        "Get important Islamic calendar events for Malaysia (1447H–1449H, Asia/Kuala_Lumpur). Gregorian dates are derived from the JAKIM lunar month table so they are never earlier than the Hijri day. Confirmed JAKIM e-Solat dates are estimated=false; later dates may still follow official moon-sighting. Filter by year, month, type, or Gregorian date. Set includeRecurring to include monthly recurring events.",
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
        calendar: calendarSchema,
      }),
    },
    async ({ year, month, type, date, includeRecurring, calendar }) => {
      const mode = resolveCalendar(calendar)
      const payload: {
        events: ReturnType<typeof toEventView>[]
        recurring?: ReturnType<typeof listRecurringEvents>
      } = {
        events: listEvents({ year, month, type, date }).map((entry) =>
          toEventView(entry, mode),
        ),
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
