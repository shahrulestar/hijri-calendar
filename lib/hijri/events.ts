import data from "../../data/islamic_events.json"

export type EventType =
  | "public_holiday"
  | "ritual"
  | "voluntary"
  | "historical"

export interface IslamicEvent {
  year: number
  month: number
  day: number
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
