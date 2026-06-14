import { differenceInMinutes, getDay } from 'date-fns'

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

// Each rule is evaluated independently; use exclusive conditions to avoid double-counting.
const SCORE_RULES = [
  { condition: (s) => s.meetingPct > 50,                              delta: -20 },
  { condition: (s) => s.meetingPct > 40 && s.meetingPct <= 50,       delta: -10 },
  { condition: (s) => (s.categoryMinutes['Health'] ?? 0) > 0,        delta: +10 },
  { condition: (s) => (s.categoryMinutes['Learning'] ?? 0) > 0,      delta: +5 },
  { condition: (s) => s.focusMinutes / 60 >= 10,                     delta: +10 },
]

export function buildStats(eventRows) {
  const categoryMinutes = {}
  const dayMinutes = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 }
  let totalMinutes = 0
  let meetingMinutes = 0
  let focusMinutes = 0

  for (const e of eventRows) {
    if (e.isAllDay) continue
    const mins = differenceInMinutes(new Date(e.endAt), new Date(e.startAt))
    if (mins <= 0) continue

    totalMinutes += mins
    const cat = e.category ?? 'Other'
    categoryMinutes[cat] = (categoryMinutes[cat] ?? 0) + mins

    const dow = getDay(new Date(e.startAt))
    dayMinutes[dow] = (dayMinutes[dow] ?? 0) + mins

    if (cat === 'Meeting') meetingMinutes += mins
    if (cat === 'Work') focusMinutes += mins
  }

  const meetingPct = totalMinutes > 0 ? Math.round((meetingMinutes / totalMinutes) * 100) : 0
  const intermediate = { categoryMinutes, meetingPct, focusMinutes }
  const score = Math.min(100, Math.max(0,
    SCORE_RULES.reduce((acc, rule) => rule.condition(intermediate) ? acc + rule.delta : acc, 70)
  ))

  const categoryBreakdown = Object.fromEntries(
    Object.entries(categoryMinutes).map(([k, v]) => [k, Math.round((v / 60) * 10) / 10])
  )

  const busiestDayIndex = Object.entries(dayMinutes).sort((a, b) => b[1] - a[1])[0]?.[0]
  const busiestDay = DAY_NAMES[busiestDayIndex] ?? null

  return {
    totalHours: Math.round((totalMinutes / 60) * 10) / 10,
    totalMinutes,
    meetingHours: Math.round((meetingMinutes / 60) * 10) / 10,
    focusHours: Math.round((focusMinutes / 60) * 10) / 10,
    meetingPct,
    categoryBreakdown,
    categoryMinutes,
    dayMinutes,
    busiestDay,
    eventCount: eventRows.length,
    score,
  }
}
