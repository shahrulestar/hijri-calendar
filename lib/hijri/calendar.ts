import data from "../../data/hijri_months.json"

export interface HijriMonth {
  year: number
  month: number
  nameMs: string
  nameEn: string
  code: string
  start: string
  end: string
  days: number
}

export interface HijriYearSummary {
  year: number
  days: number
  type: string
}

export type CalendarMode = "hijri" | "gregorian" | "both"

export interface MonthView {
  year: number
  month: number
  nameMs: string
  nameEn: string
  code: string
  days: number
  hijri: { start: string; end: string }
  gregorian: {
    start: string
    end: string
    /** Gregorian calendar year(s) covered — e.g. [2026, 2027] when a month spans New Year */
    years: number[]
  }
}

export interface DateLookupView {
  hijri: {
    year: number
    month: number
    day: number
    display: string
  }
  gregorian: { iso: string }
  month: MonthView
}

const months = data.months as HijriMonth[]
const years = data.years as HijriYearSummary[]

const TIMEZONE = "Asia/Kuala_Lumpur"

function parseIsoDate(iso: string): Date {
  const [year, month, day] = iso.split("-").map(Number)
  return new Date(Date.UTC(year, month - 1, day))
}

function isWithinRange(date: string, start: string, end: string): boolean {
  return date >= start && date <= end
}

export function formatHijriDate(
  day: number | string,
  nameMs: string,
  year: number,
): string {
  return `${day} ${nameMs} ${year}`
}

export function gregorianYears(start: string, end: string): number[] {
  const startYear = Number(start.slice(0, 4))
  const endYear = Number(end.slice(0, 4))
  if (startYear === endYear) return [startYear]
  return [startYear, endYear]
}

export function toMonthView(entry: HijriMonth): MonthView {
  return {
    year: entry.year,
    month: entry.month,
    nameMs: entry.nameMs,
    nameEn: entry.nameEn,
    code: entry.code,
    days: entry.days,
    hijri: {
      start: formatHijriDate(1, entry.nameMs, entry.year),
      end: formatHijriDate(entry.days, entry.nameMs, entry.year),
    },
    gregorian: {
      start: entry.start,
      end: entry.end,
      years: gregorianYears(entry.start, entry.end),
    },
  }
}

export function orderCalendarFields<T extends object>(
  value: T,
  calendar: CalendarMode,
): T {
  if (calendar === "both") return value

  const preferred = calendar === "hijri" ? "hijri" : "gregorian"
  const secondary = calendar === "hijri" ? "gregorian" : "hijri"
  const record = value as Record<string, unknown>
  const ordered: Record<string, unknown> = {}

  for (const [key, entry] of Object.entries(record)) {
    if (key === "hijri" || key === "gregorian") continue
    ordered[key] = entry
  }

  if (preferred in record) ordered[preferred] = record[preferred]
  if (secondary in record) ordered[secondary] = record[secondary]

  return ordered as T
}

export function listMonths(filters?: { year?: number }): HijriMonth[] {
  return months.filter((entry) => {
    if (filters?.year !== undefined && entry.year !== filters.year) return false
    return true
  })
}

export function getMonth(year: number, month: number): HijriMonth | undefined {
  return months.find((entry) => entry.year === year && entry.month === month)
}

export function getYearSummaries(): HijriYearSummary[] {
  return years
}

export function getTodayIso(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date())
}

export function lookupDate(date?: string): DateLookupView | undefined {
  const targetDate = date ?? getTodayIso()
  const month = months.find((entry) =>
    isWithinRange(targetDate, entry.start, entry.end),
  )

  if (!month) return undefined

  const start = parseIsoDate(month.start)
  const current = parseIsoDate(targetDate)
  const day =
    Math.floor((current.getTime() - start.getTime()) / 86_400_000) + 1

  return {
    hijri: {
      year: month.year,
      month: month.month,
      day,
      display: formatHijriDate(day, month.nameMs, month.year),
    },
    gregorian: { iso: targetDate },
    month: toMonthView(month),
  }
}

export function formatJson(value: unknown): string {
  return JSON.stringify(value, null, 2)
}
