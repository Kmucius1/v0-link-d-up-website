const TIME_ZONE = 'America/New_York'

/** Converts a wall-clock date/time in `timeZone` to the correct UTC instant, honoring DST. */
function zonedTimeToUtc(year: number, month1: number, day: number, hour: number, minute: number, timeZone: string): Date {
  const desired = Date.UTC(year, month1 - 1, day, hour, minute)
  const dtf = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
  const parts = Object.fromEntries(dtf.formatToParts(new Date(desired)).map((p) => [p.type, p.value]))
  const asUtc = Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    Number(parts.hour) === 24 ? 0 : Number(parts.hour),
    Number(parts.minute),
    Number(parts.second)
  )
  const offset = asUtc - desired
  return new Date(desired - offset)
}

/** The calendar day (1-31) of the third Thursday of the given month. */
function thirdThursdayDay(year: number, month1: number): number {
  const firstOfMonth = new Date(Date.UTC(year, month1 - 1, 1))
  const firstThursday = 1 + ((4 - firstOfMonth.getUTCDay() + 7) % 7) // Thursday = 4
  return firstThursday + 14
}

/** UTC instant of 6:00 PM Eastern on the third Thursday of `year`-`month1` (1-based month). */
export function thirdThursdayEventDateUtc(year: number, month1: number): Date {
  const day = thirdThursdayDay(year, month1)
  return zonedTimeToUtc(year, month1, day, 18, 0, TIME_ZONE)
}

export function ordinal(n: number): string {
  const suffixes = ['th', 'st', 'nd', 'rd']
  const v = n % 100
  return String(n) + (suffixes[(v - 20) % 10] ?? suffixes[v] ?? suffixes[0])
}
