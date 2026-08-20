import { months, TIMEZONE } from "./data"
import {
  formatHijriDate,
  gregorianYears,
} from "./calendar"
import {
  addCalendarDays,
  type EventType,
  type EventView,
  listEvents,
  listRecurringEvents,
  toEventView,
} from "./events"

export const ALL_EVENT_TYPES = [
  "public_holiday",
  "ritual",
  "voluntary",
  "historical",
] as const satisfies readonly EventType[]

export const DEFAULT_ICS_TYPES: EventType[] = [
  "ritual",
  "voluntary",
  "historical",
]

export interface IcsBuildOptions {
  types: EventType[]
  year?: number
  month?: number
  lang: "en" | "ms"
  includeRecurring: boolean
}

const ICS_HOST = "hijri.shahrulestar.com"

function isEventType(value: string): value is EventType {
  return (ALL_EVENT_TYPES as readonly string[]).includes(value)
}

function parseBoundedInt(
  value: string | null,
  min: number,
  max: number,
): { ok: true; value?: number } | { ok: false; error: string } {
  if (value === null || value === "") return { ok: true }
  const parsed = Number(value)
  if (!Number.isInteger(parsed) || parsed < min || parsed > max) {
    return { ok: false, error: `Expected an integer between ${min} and ${max}` }
  }
  return { ok: true, value: parsed }
}

export function parseIcsSearchParams(
  params: URLSearchParams,
): IcsBuildOptions | { error: string } {
  const year = parseBoundedInt(params.get("year"), 1447, 1450)
  if (!year.ok) return { error: `Invalid year. ${year.error}` }

  const month = parseBoundedInt(params.get("month"), 1, 12)
  if (!month.ok) return { error: `Invalid month. ${month.error}` }

  const typeParam = params.get("type")
  if (typeParam && !isEventType(typeParam)) {
    return {
      error: `Invalid type. Use one of: ${ALL_EVENT_TYPES.join(", ")}`,
    }
  }

  const includeParam = params.get("include")
  if (
    includeParam &&
    includeParam !== "all" &&
    includeParam !== "public_holiday"
  ) {
    return { error: "Invalid include. Use public_holiday or all." }
  }

  const langParam = params.get("lang")
  if (langParam && langParam !== "en" && langParam !== "ms") {
    return { error: "Invalid lang. Use en or ms." }
  }

  const recurringParam = params.get("includeRecurring")
  const includeRecurring =
    recurringParam === "1" ||
    recurringParam === "true" ||
    recurringParam === "yes"

  let types: EventType[]
  if (typeParam && isEventType(typeParam)) {
    types = [typeParam]
  } else if (includeParam === "all") {
    types = [...ALL_EVENT_TYPES]
  } else if (includeParam === "public_holiday") {
    types = [...DEFAULT_ICS_TYPES, "public_holiday"]
  } else {
    types = [...DEFAULT_ICS_TYPES]
  }

  return {
    types,
    year: year.value,
    month: month.value,
    lang: langParam === "ms" ? "ms" : "en",
    includeRecurring,
  }
}

export function icsFilename(options: IcsBuildOptions): string {
  const parts = ["islamic-events"]
  if (options.year !== undefined) parts.push(String(options.year))
  if (options.month !== undefined) parts.push(`m${options.month}`)

  if (options.types.length === 1) {
    parts.push(options.types[0])
  } else if (options.types.length === ALL_EVENT_TYPES.length) {
    parts.push("all")
  }

  if (options.includeRecurring) parts.push("recurring")
  return `${parts.join("-")}.ics`
}

function isoToIcsDate(iso: string): string {
  return iso.replaceAll("-", "")
}

function slugify(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/['’]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

function escapeIcsText(value: string): string {
  return value
    .replaceAll("\\", "\\\\")
    .replaceAll(";", "\\;")
    .replaceAll(",", "\\,")
    .replaceAll(/\r\n|\n|\r/g, "\\n")
}

function foldIcsLine(line: string): string {
  const max = 75
  if (line.length <= max) return line
  const chunks: string[] = [line.slice(0, max)]
  let remaining = line.slice(max)
  while (remaining.length > 0) {
    chunks.push(` ${remaining.slice(0, max - 1)}`)
    remaining = remaining.slice(max - 1)
  }
  return chunks.join("\r\n")
}

function formatIcsUtcStamp(date = new Date()): string {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "")
}

function exclusiveEnd(start: string, end: string | null): string {
  return addCalendarDays(end ?? start, 1)
}

function eventUid(view: EventView): string {
  const slug = slugify(view.nameEn) || "event"
  const day =
    typeof view.hijri.day === "number"
      ? String(view.hijri.day)
      : view.hijri.day.replaceAll("-", "_")
  return `${slug}-${view.hijri.year}H-${view.hijri.month}-${day}@${ICS_HOST}`
}

function expandRecurringEvents(options: IcsBuildOptions): EventView[] {
  const templates = listRecurringEvents({ month: options.month })
  const views: EventView[] = []

  for (const template of templates) {
    if (!options.types.includes(template.type)) continue

    for (const month of months) {
      if (options.year !== undefined && month.year !== options.year) continue
      if (options.month !== undefined && month.month !== options.month) continue
      if (template.excludeMonths?.includes(month.month)) continue

      for (const day of template.days) {
        if (day < 1 || day > month.days) continue
        const start = addCalendarDays(month.start, day - 1)
        views.push({
          nameMs: template.nameMs,
          nameEn: template.nameEn,
          type: template.type,
          timezone: TIMEZONE,
          hijri: {
            year: month.year,
            month: month.month,
            day,
            display: formatHijriDate(day, month.nameMs, month.year),
          },
          gregorian: {
            start,
            end: null,
            years: gregorianYears(start, start),
          },
        })
      }
    }
  }

  return views
}

function veventLines(view: EventView, lang: "en" | "ms", stamp: string): string[] {
  const summary = lang === "ms" ? view.nameMs : view.nameEn
  const description = `${view.hijri.display} — JAKIM Malaysia`
  const start = isoToIcsDate(view.gregorian.start)
  const end = isoToIcsDate(exclusiveEnd(view.gregorian.start, view.gregorian.end))

  return [
    "BEGIN:VEVENT",
    `UID:${eventUid(view)}`,
    `DTSTAMP:${stamp}`,
    `DTSTART;VALUE=DATE:${start}`,
    `DTEND;VALUE=DATE:${end}`,
    `SUMMARY:${escapeIcsText(summary)}`,
    `DESCRIPTION:${escapeIcsText(description)}`,
    "END:VEVENT",
  ]
}

export function buildIslamicEventsIcs(options: IcsBuildOptions): string {
  const stamp = formatIcsUtcStamp()
  const events = listEvents({
    year: options.year,
    month: options.month,
  })
    .filter((entry) => options.types.includes(entry.type))
    .map((entry) => toEventView(entry))

  const views = options.includeRecurring
    ? [...events, ...expandRecurringEvents(options)]
    : events

  views.sort((a, b) => {
    const byDate = a.gregorian.start.localeCompare(b.gregorian.start)
    if (byDate !== 0) return byDate
    return a.nameEn.localeCompare(b.nameEn)
  })

  const calendarName =
    options.lang === "ms" ? "Acara Islam (Malaysia)" : "Islamic Events (Malaysia)"

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Hijri Calendar MCP//Islamic Events MY//EN",
    "CALSCALE:GREGORIAN",
    `X-WR-CALNAME:${escapeIcsText(calendarName)}`,
    `X-WR-TIMEZONE:${TIMEZONE}`,
    ...views.flatMap((view) => veventLines(view, options.lang, stamp)),
    "END:VCALENDAR",
  ]

  return `${lines.map(foldIcsLine).join("\r\n")}\r\n`
}
