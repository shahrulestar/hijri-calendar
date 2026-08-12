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
  status: "confirmed" | "estimated"
}

export interface HijriYearSummary {
  year: number
  days: number
  type: string
}

export interface DateLookup {
  date: string
  day: number
  month: HijriMonth
}

const months = data.months as HijriMonth[]
const years = data.years as HijriYearSummary[]

const TIMEZONE = "Asia/Kuala_Lumpur"

function parseIsoDate(iso: string): Date {
  const [year, month, day] = iso.split("-").map(Number)
  return new Date(Date.UTC(year, month - 1, day))
}

function formatIsoDate(date: Date): string {
  return date.toISOString().slice(0, 10)
}

function isWithinRange(date: string, start: string, end: string): boolean {
  return date >= start && date <= end
}

export function listMonths(filters?: {
  year?: number
  status?: HijriMonth["status"]
}): HijriMonth[] {
  return months.filter((entry) => {
    if (filters?.year !== undefined && entry.year !== filters.year) return false
    if (filters?.status !== undefined && entry.status !== filters.status) return false
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

export function lookupDate(date?: string): DateLookup | undefined {
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
    date: targetDate,
    day,
    month,
  }
}

export function formatJson(value: unknown): string {
  return JSON.stringify(value, null, 2)
}
