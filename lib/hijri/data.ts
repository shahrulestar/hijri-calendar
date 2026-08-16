import meta from "../../data/takwim/meta.json"
import y2025 from "../../data/takwim/2025.json"
import y2026 from "../../data/takwim/2026.json"
import y2027 from "../../data/takwim/2027.json"
import y2028 from "../../data/takwim/2028.json"

import type { HijriMonth, HijriYearSummary, TakwimDay } from "./calendar"
import type { EventTemplate, RecurringEvent } from "./events"

const YEAR_FILES = [y2025, y2026, y2027, y2028]

export const TIMEZONE = meta.timezone as "Asia/Kuala_Lumpur"

export const hijriYearSummaries = meta.hijriYears as HijriYearSummary[]
export const eventTemplates = meta.events as EventTemplate[]
export const recurring = meta.recurring as RecurringEvent[]

export const takwimDays = YEAR_FILES.flatMap((year) => year.days) as TakwimDay[]
export const months = YEAR_FILES.flatMap((year) => year.months) as HijriMonth[]
