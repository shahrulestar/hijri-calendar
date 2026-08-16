import { mkdirSync, readFileSync, writeFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const root = join(dirname(fileURLToPath(import.meta.url)), "..")
const outDir = join(root, "data/takwim")

const takwim = JSON.parse(readFileSync(join(root, "data/takwim_hijri.json"), "utf8"))
const monthsFile = JSON.parse(readFileSync(join(root, "data/hijri_months.json"), "utf8"))
const eventsFile = JSON.parse(readFileSync(join(root, "data/islamic_events.json"), "utf8"))

const YEARS = [2025, 2026, 2027, 2028]

function gregorianYear(iso) {
  return Number(iso.slice(0, 4))
}

const buckets = Object.fromEntries(
  YEARS.map((year) => [
    year,
    {
      gregorianYear: year,
      hijriYears: [],
      title: takwim.years[String(year)]?.title ?? `TAKWIM ${year}`,
      days: [],
      months: [],
      events: [],
    },
  ]),
)

let dayCount = 0
for (const [key, block] of Object.entries(takwim.years)) {
  const year = Number(key)
  if (!buckets[year]) throw new Error(`Unexpected takwim year ${year}`)
  buckets[year].days = block.days
  buckets[year].title = block.title
  dayCount += block.days.length
}

for (const month of monthsFile.months) {
  const year = gregorianYear(month.start)
  if (!buckets[year]) throw new Error(`Month ${month.year}H/${month.month} start ${month.start} has no year file`)
  buckets[year].months.push(month)
}

for (const event of eventsFile.events) {
  const year = gregorianYear(event.start)
  if (!buckets[year]) throw new Error(`Event ${event.nameMs} start ${event.start} has no year file`)
  buckets[year].events.push(event)
}

for (const year of YEARS) {
  const hijri = new Set(buckets[year].days.map((day) => day.hijri_year))
  buckets[year].hijriYears = [...hijri].sort((a, b) => a - b)
}

const meta = {
  source: [
    takwim.source,
    eventsFile.source,
  ].join("; "),
  criteria: takwim.criteria,
  timezone: takwim.timezone,
  note: takwim.note,
  day_names: takwim.day_names,
  hijri_months: takwim.hijri_months,
  hijriYears: monthsFile.years,
  recurring: eventsFile.recurring,
}

mkdirSync(outDir, { recursive: true })
writeFileSync(join(outDir, "meta.json"), `${JSON.stringify(meta, null, 2)}\n`)

for (const year of YEARS) {
  writeFileSync(join(outDir, `${year}.json`), `${JSON.stringify(buckets[year], null, 2)}\n`)
}

const placedMonths = YEARS.reduce((sum, year) => sum + buckets[year].months.length, 0)
const placedEvents = YEARS.reduce((sum, year) => sum + buckets[year].events.length, 0)

if (placedMonths !== monthsFile.months.length) {
  throw new Error(`Month count mismatch: ${placedMonths} vs ${monthsFile.months.length}`)
}
if (placedEvents !== eventsFile.events.length) {
  throw new Error(`Event count mismatch: ${placedEvents} vs ${eventsFile.events.length}`)
}

const originalDays = Object.values(takwim.years).reduce((sum, block) => sum + block.days.length, 0)
if (dayCount !== originalDays) {
  throw new Error(`Day count mismatch: ${dayCount} vs ${originalDays}`)
}

console.log(
  JSON.stringify(
    {
      days: dayCount,
      months: placedMonths,
      events: placedEvents,
      perYear: Object.fromEntries(
        YEARS.map((year) => [
          year,
          {
            days: buckets[year].days.length,
            months: buckets[year].months.length,
            events: buckets[year].events.length,
            hijriYears: buckets[year].hijriYears,
          },
        ]),
      ),
    },
    null,
    2,
  ),
)
