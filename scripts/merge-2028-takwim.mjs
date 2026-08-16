import { readFileSync, writeFileSync } from "node:fs"

const SOURCE =
  "/Users/shahrulestar/Downloads/takwin_hijri_1449_1450.json"
const META =
  "/Users/shahrulestar/labs/islamic-calendar-mcp/data/takwim/meta.json"
const TARGET =
  "/Users/shahrulestar/labs/islamic-calendar-mcp/data/takwim/2028.json"

const DAY_CODE = {
  Ahad: "A",
  Isnin: "I",
  Selasa: "T",
  Rabu: "R",
  Khamis: "K",
  Jumaat: "J",
  Sabtu: "S",
}

const CODE_EN = {
  RBA: "RA1",
  RBT: "RA2",
  JMA: "JM1",
  JMT: "JM2",
}

const source = JSON.parse(readFileSync(SOURCE, "utf8"))
const meta = JSON.parse(readFileSync(META, "utf8"))
const target = JSON.parse(readFileSync(TARGET, "utf8"))

const namesMs = meta.hijri_months.ms
const namesEn = meta.hijri_months.en

if (source.days.length !== 366) {
  throw new Error(`Expected 366 days, got ${source.days.length}`)
}

const days = source.days.map((day) => {
  const codeMs = day.hijriCodeMs === "SYB" ? "SYA" : day.hijriCodeMs
  const codeEn = CODE_EN[day.hijriCode] ?? day.hijriCode
  const nameMs = namesMs[codeMs]
  const nameEn = namesEn[codeEn]
  const dayCode = DAY_CODE[day.weekdayMs]

  if (!nameMs || !nameEn || !dayCode) {
    throw new Error(`Unmapped day ${day.gregorianDate}: ${JSON.stringify(day)}`)
  }

  return {
    gregorian_date: day.gregorianDate,
    day_name: day.weekdayMs,
    day_code: dayCode,
    hijri_date: `${day.hijriDay} ${nameMs} ${day.hijriYear}H`,
    hijri_year: day.hijriYear,
    hijri_day: day.hijriDay,
    estimated: false,
    hijri_month_code_ms: codeMs,
    hijri_month_code_en: codeEn,
    hijri_month_name_ms: nameMs,
    hijri_month_name_en: nameEn,
  }
})

target.days = days
target.hijriYears = [...new Set(days.map((day) => day.hijri_year))].sort(
  (a, b) => a - b,
)
target.title = "TAKWIM 2028 MILADIAH / 1449 - 1450 HIJRIAH BAGI MALAYSIA"

writeFileSync(TARGET, `${JSON.stringify(target, null, 2)}\n`)
console.log(`Wrote ${days.length} days for 2028`)
