import { hijriYearSummaries, months, takwimDays, TIMEZONE } from "./data"

export interface HijriMonth {
  year: number
  month: number
  nameMs: string
  nameEn: string
  codeMs: string
  codeEn: string
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
  codeMs: string
  codeEn: string
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
  estimated: boolean
  month: MonthView
}

export interface TakwimDay {
  gregorian_date: string
  day_name: string
  day_code: string
  hijri_date: string
  hijri_year: number
  hijri_month_code_ms: string
  hijri_month_code_en: string
  hijri_month_name_ms: string
  hijri_month_name_en: string
  hijri_day: number
  estimated: boolean
}

export interface DayView {
  gregorian: { iso: string; dayName: string; dayCode: string }
  hijri: {
    year: number
    month: number
    day: number
    codeMs: string
    codeEn: string
    nameMs: string
    nameEn: string
    display: string
  }
  estimated: boolean
}

export interface ListDaysFilters {
  date?: string
  hijriYear?: number
  month?: number
  from?: string
  to?: string
}

const monthByCode = new Map(
  months.map((entry) => [`${entry.year}:${entry.codeMs}`, entry] as const),
)

const daysByDate = new Map(
  takwimDays.map((day) => [day.gregorian_date, day] as const),
)

const MAX_DAY_RANGE = 62

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
    codeMs: entry.codeMs,
    codeEn: entry.codeEn,
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
  return hijriYearSummaries
}

export function getTodayIso(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date())
}

function monthForDay(day: TakwimDay): HijriMonth | undefined {
  return monthByCode.get(`${day.hijri_year}:${day.hijri_month_code_ms}`)
}

export function toDayView(day: TakwimDay): DayView {
  const month = monthForDay(day)
  return {
    gregorian: {
      iso: day.gregorian_date,
      dayName: day.day_name,
      dayCode: day.day_code,
    },
    hijri: {
      year: day.hijri_year,
      month: month?.month ?? 0,
      day: day.hijri_day,
      codeMs: day.hijri_month_code_ms,
      codeEn: day.hijri_month_code_en,
      nameMs: day.hijri_month_name_ms,
      nameEn: day.hijri_month_name_en,
      display: day.hijri_date,
    },
    estimated: day.estimated,
  }
}

export function lookupDate(date?: string): DateLookupView | undefined {
  const targetDate = date ?? getTodayIso()
  const day = daysByDate.get(targetDate)
  if (!day) return undefined

  const month = monthForDay(day)
  if (!month) return undefined

  return {
    hijri: {
      year: month.year,
      month: month.month,
      day: day.hijri_day,
      display: formatHijriDate(day.hijri_day, month.nameMs, month.year),
    },
    gregorian: { iso: targetDate },
    estimated: day.estimated,
    month: toMonthView(month),
  }
}

export function listDays(filters: ListDaysFilters): TakwimDay[] | { error: string } {
  const { date, hijriYear, month, from, to } = filters
  const hasDate = date !== undefined
  const hasHijriMonth = hijriYear !== undefined && month !== undefined
  const hasRange = from !== undefined && to !== undefined

  if (!hasDate && !hasHijriMonth && !hasRange) {
    return {
      error:
        "Provide date, year+month (Hijri), or from+to (Gregorian, max 62 days).",
    }
  }

  if ((from !== undefined) !== (to !== undefined)) {
    return { error: "from and to must be provided together." }
  }

  if (month !== undefined && hijriYear === undefined) {
    return { error: "month requires year (Hijri)." }
  }

  if (hasRange) {
    if (from > to) return { error: "from must be on or before to." }
    const start = parseIsoDate(from)
    const end = parseIsoDate(to)
    const span =
      Math.floor((end.getTime() - start.getTime()) / 86_400_000) + 1
    if (span > MAX_DAY_RANGE) {
      return {
        error: `Gregorian range cannot exceed ${MAX_DAY_RANGE} days.`,
      }
    }
  }

  return takwimDays.filter((day) => {
    if (hasDate && day.gregorian_date !== date) return false
    if (hijriYear !== undefined && day.hijri_year !== hijriYear) return false
    if (month !== undefined) {
      const entry = monthForDay(day)
      if (!entry || entry.month !== month) return false
    }
    if (hasRange && !isWithinRange(day.gregorian_date, from, to)) return false
    return true
  })
}

export function formatJson(value: unknown): string {
  return JSON.stringify(value, null, 2)
}
