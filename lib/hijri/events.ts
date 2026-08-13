import data from "../../data/islamic_events.json"

import {
  type CalendarMode,
  formatHijriDate,
  getMonth,
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

const events = data.events as IslamicEvent[]
const recurring = data.recurring as RecurringEvent[]

export function listEvents(filters?: {
  year?: number
  month?: number
  type?: EventType
  date?: string
}): IslamicEvent[] {
  return events.filter((entry) => {
    if (filters?.year !== undefined && entry.year !== filters.year) return false
    if (filters?.month !== undefined && entry.month !== filters.month)
      return false
    if (filters?.type !== undefined && entry.type !== filters.type) return false
    if (filters?.date !== undefined) {
      const end = entry.end ?? entry.start
      if (filters.date < entry.start || filters.date > end) return false
    }
    return true
  })
}

export function listRecurringEvents(): RecurringEvent[] {
  return recurring
}

export function toEventView(
  entry: IslamicEvent,
  calendar: CalendarMode = "both",
): EventView {
  const month = getMonth(entry.year, entry.month)
  const nameMs = month?.nameMs ?? `Month ${entry.month}`

  return orderCalendarFields(
    {
      nameMs: entry.nameMs,
      nameEn: entry.nameEn,
      type: entry.type,
      estimated: entry.estimated,
      hijri: {
        year: entry.year,
        month: entry.month,
        day: entry.day,
        display: formatHijriDate(entry.day, nameMs, entry.year),
      },
      gregorian: {
        start: entry.start,
        end: entry.end,
        years: gregorianYears(entry.start, entry.end ?? entry.start),
      },
    },
    calendar,
  )
}
