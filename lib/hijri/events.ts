import {
  eventTemplates,
  months,
  recurring,
  TIMEZONE,
} from "./data"
import {
  type CalendarMode,
  formatHijriDate,
  getMonth,
  getTodayIso,
  gregorianYears,
  orderCalendarFields,
} from "./calendar"

export type EventType =
  | "public_holiday"
  | "ritual"
  | "voluntary"
  | "historical"

export interface EventTemplate {
  month: number
  day: number | string
  nameMs: string
  nameEn: string
  type: EventType
}

export interface IslamicEvent extends EventTemplate {
  year: number
}

export interface RecurringEvent {
  nameMs: string
  nameEn: string
  type: EventType
  days: number[]
  monthly: boolean
  /** Hijri months where this recurring event does not apply (e.g. 9 = Ramadan). */
  excludeMonths?: number[]
}

export interface EventView {
  nameMs: string
  nameEn: string
  type: EventType
  timezone: "Asia/Kuala_Lumpur"
  hijri: {
    year: number
    month: number
    day: number | string
    display: string
  }
  gregorian: {
    start: string
    end: string | null
    years: number[]
  }
}


function parseIsoUtc(iso: string): number {
  const [year, month, day] = iso.split("-").map(Number)
  return Date.UTC(year, month - 1, day)
}

function formatIsoUtc(ms: number): string {
  const date = new Date(ms)
  const year = date.getUTCFullYear()
  const month = String(date.getUTCMonth() + 1).padStart(2, "0")
  const day = String(date.getUTCDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

/** Calendar-day arithmetic in UTC noon-safe ISO dates (Malaysia civil date). */
export function addCalendarDays(iso: string, days: number): string {
  return formatIsoUtc(parseIsoUtc(iso) + days * 86_400_000)
}

function parseDayRange(day: number | string): { startDay: number; endDay: number } {
  if (typeof day === "number") return { startDay: day, endDay: day }
  if (day.includes("-")) {
    const [startDay, endDay] = day.split("-").map(Number)
    return { startDay, endDay }
  }
  const value = Number(day)
  return { startDay: value, endDay: value }
}

/** Resolve Gregorian range from the JAKIM lunar month table. */
export function resolveEventGregorian(entry: Pick<IslamicEvent, "year" | "month" | "day">): {
  start: string
  end: string | null
} {
  const month = getMonth(entry.year, entry.month)
  if (!month) {
    throw new Error(
      `No lunar month for ${entry.year}H month ${entry.month} (Asia/Kuala_Lumpur)`,
    )
  }

  const { startDay, endDay } = parseDayRange(entry.day)
  if (startDay < 1 || endDay > month.days || startDay > endDay) {
    throw new Error(
      `Invalid Hijri day ${entry.day} for ${entry.year}H/${entry.month} (${month.days} days)`,
    )
  }

  const start = addCalendarDays(month.start, startDay - 1)
  const end =
    endDay === startDay ? null : addCalendarDays(month.start, endDay - 1)

  return { start, end }
}

function eventFitsMonth(
  template: EventTemplate,
  monthDays: number,
): boolean {
  const { startDay, endDay } = parseDayRange(template.day)
  return startDay >= 1 && endDay <= monthDays && startDay <= endDay
}

const hijriYears = [...new Set(months.map((entry) => entry.year))].sort(
  (a, b) => a - b,
)

export function listEvents(filters?: {
  year?: number
  month?: number
  type?: EventType
  date?: string
}): IslamicEvent[] {
  const targetDate = filters?.date
  const instances: IslamicEvent[] = []

  for (const year of hijriYears) {
    if (filters?.year !== undefined && year !== filters.year) continue

    for (const template of eventTemplates) {
      if (filters?.month !== undefined && template.month !== filters.month)
        continue
      if (filters?.type !== undefined && template.type !== filters.type)
        continue

      const month = getMonth(year, template.month)
      if (!month || !eventFitsMonth(template, month.days)) continue

      const entry: IslamicEvent = { year, ...template }
      if (targetDate !== undefined) {
        const { start, end } = resolveEventGregorian(entry)
        const last = end ?? start
        if (targetDate < start || targetDate > last) continue
      }

      instances.push(entry)
    }
  }

  return instances
}

export function listRecurringEvents(filters?: {
  month?: number
}): RecurringEvent[] {
  return recurring.filter((entry) => {
    if (filters?.month === undefined) return true
    return !entry.excludeMonths?.includes(filters.month)
  })
}

/** Upcoming events on or after `today` (ISO YYYY-MM-DD, Malaysia civil date). */
export function listUpcomingEvents(
  today: string = getTodayIso(),
  limit = 5,
): EventView[] {
  return listEvents()
    .map((entry) => toEventView(entry))
    .filter((view) => {
      const last = view.gregorian.end ?? view.gregorian.start
      return last >= today
    })
    .sort((a, b) => a.gregorian.start.localeCompare(b.gregorian.start))
    .slice(0, limit)
}

export function toEventView(
  entry: IslamicEvent,
  calendar: CalendarMode = "both",
): EventView {
  const month = getMonth(entry.year, entry.month)
  const nameMs = month?.nameMs ?? `Month ${entry.month}`
  const { start, end } = resolveEventGregorian(entry)

  return orderCalendarFields(
    {
      nameMs: entry.nameMs,
      nameEn: entry.nameEn,
      type: entry.type,
      timezone: TIMEZONE,
      hijri: {
        year: entry.year,
        month: entry.month,
        day: entry.day,
        display: formatHijriDate(entry.day, nameMs, entry.year),
      },
      gregorian: {
        start,
        end,
        years: gregorianYears(start, end ?? start),
      },
    },
    calendar,
  )
}

/** Malaysia "today" helper for callers that need local civil date. */
export function todayInMalaysia(): string {
  return getTodayIso()
}
