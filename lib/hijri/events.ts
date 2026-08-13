import data from "../../data/islamic_events.json"

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

export interface IslamicEvent {
  year: number
  month: number
  day: number | string
  nameMs: string
  nameEn: string
  type: EventType
  /** Stored Gregorian hint; runtime always re-derives from the lunar month table. */
  start: string
  end: string | null
  estimated: boolean
}

export interface RecurringEvent {
  nameMs: string
  nameEn: string
  type: EventType
  days: number[]
  monthly: boolean
}

export interface EventView {
  nameMs: string
  nameEn: string
  type: EventType
  estimated: boolean
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

const TIMEZONE = "Asia/Kuala_Lumpur" as const
const events = data.events as IslamicEvent[]
const recurring = data.recurring as RecurringEvent[]

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

/**
 * Resolve Gregorian range from the JAKIM lunar month table.
 * Never trusts stored event.start/end alone — prevents early/stale dates.
 */
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

export function listEvents(filters?: {
  year?: number
  month?: number
  type?: EventType
  date?: string
}): IslamicEvent[] {
  const targetDate = filters?.date

  return events.filter((entry) => {
    if (filters?.year !== undefined && entry.year !== filters.year) return false
    if (filters?.month !== undefined && entry.month !== filters.month)
      return false
    if (filters?.type !== undefined && entry.type !== filters.type) return false

    if (targetDate !== undefined) {
      const { start, end } = resolveEventGregorian(entry)
      const last = end ?? start
      if (targetDate < start || targetDate > last) return false
    }

    return true
  })
}

export function listRecurringEvents(): RecurringEvent[] {
  return recurring
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
      estimated: entry.estimated,
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
