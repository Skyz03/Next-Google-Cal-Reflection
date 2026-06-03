import { db } from '@/lib/db/index.js'
import { events, reflections } from '@/lib/db/schema.js'
import { and, eq, gte, lt } from 'drizzle-orm'
import {
  startOfWeek, endOfWeek,
  startOfMonth, endOfMonth,
  format, differenceInMinutes, getDay,
} from 'date-fns'

function buildStats(eventRows) {
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

  const totalHours = totalMinutes / 60
  const categoryBreakdown = Object.fromEntries(
    Object.entries(categoryMinutes).map(([k, v]) => [k, Math.round((v / 60) * 10) / 10])
  )

  const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const busiestDayIndex = Object.entries(dayMinutes).sort((a, b) => b[1] - a[1])[0]?.[0]
  const busiestDay = DAY_NAMES[busiestDayIndex] ?? null

  const meetingPct = totalMinutes > 0 ? Math.round((meetingMinutes / totalMinutes) * 100) : 0

  let score = 70
  if (meetingPct > 50) score -= 20
  else if (meetingPct > 40) score -= 10
  if (categoryMinutes['Health']) score += 10
  if (categoryMinutes['Learning']) score += 5
  if (categoryMinutes['Work'] && focusMinutes / 60 >= 10) score += 10
  score = Math.min(100, Math.max(0, score))

  return {
    totalHours: Math.round(totalHours * 10) / 10,
    totalMinutes,
    meetingHours: Math.round((meetingMinutes / 60) * 10) / 10,
    focusHours: Math.round((focusMinutes / 60) * 10) / 10,
    meetingPct,
    categoryBreakdown,
    busiestDay,
    eventCount: eventRows.length,
    score,
  }
}

function detectPatterns(stats) {
  const patterns = []

  if (stats.meetingPct > 50) {
    patterns.push(`Over half your tracked time (${stats.meetingPct}%) was in meetings.`)
  } else if (stats.meetingPct < 20 && stats.totalHours > 5) {
    patterns.push(`Low meeting load — ${stats.meetingPct}% of your week was in meetings, leaving good space for focused work.`)
  }

  if (stats.busiestDay) {
    patterns.push(`${stats.busiestDay} was your busiest day.`)
  }

  if (stats.categoryBreakdown['Health']) {
    patterns.push(`You logged ${stats.categoryBreakdown['Health']}h of health-related activity — great habit.`)
  }

  if (stats.focusHours >= 10) {
    patterns.push(`Strong focus time: ${stats.focusHours}h of deep work logged.`)
  } else if (stats.focusHours > 0 && stats.focusHours < 5) {
    patterns.push(`Focus time was low this week — only ${stats.focusHours}h of deep work.`)
  }

  if (stats.categoryBreakdown['Learning']) {
    patterns.push(`You invested ${stats.categoryBreakdown['Learning']}h in learning.`)
  }

  return patterns.slice(0, 4)
}

function buildRecommendations(stats) {
  const recs = []

  if (stats.meetingPct > 40) {
    recs.push('Consider batching meetings on 2–3 days to protect longer focus blocks.')
  }
  if (!stats.categoryBreakdown['Health']) {
    recs.push('No health events this period — even a 30-min walk counts.')
  }
  if (stats.focusHours < 8 && stats.totalHours > 10) {
    recs.push('Try scheduling at least one 2-hour deep work block per day before noon.')
  }
  if (!stats.categoryBreakdown['Learning']) {
    recs.push('No learning time logged — consider blocking 30 min for reading or a course.')
  }

  return recs.slice(0, 3)
}

function buildSummary(stats, period, start, end) {
  const dateRange = period === 'weekly'
    ? `${format(start, 'MMM d')}–${format(end, 'MMM d')}`
    : format(start, 'MMMM yyyy')

  if (stats.totalHours === 0) {
    return `No calendar events were tracked for ${dateRange}.`
  }

  const topCat = Object.entries(stats.categoryBreakdown).sort((a, b) => b[1] - a[1])[0]
  const topCatStr = topCat ? ` Most time went to ${topCat[0]} (${topCat[1]}h).` : ''

  return `You tracked ${stats.totalHours}h across ${stats.eventCount} events during ${dateRange}.${topCatStr} Meeting load was ${stats.meetingPct}% of total time.`
}

export async function generateWeeklyReflection(userId, date = new Date()) {
  const start = startOfWeek(date, { weekStartsOn: 1 })
  const end = endOfWeek(date, { weekStartsOn: 1 })

  const eventRows = await db
    .select()
    .from(events)
    .where(and(eq(events.userId, userId), gte(events.startAt, start), lt(events.startAt, end)))

  const stats = buildStats(eventRows)
  const patterns = detectPatterns(stats)
  const recommendations = buildRecommendations(stats)
  const summary = buildSummary(stats, 'weekly', start, end)

  const insights = { patterns, recommendations, score: stats.score }

  await db
    .insert(reflections)
    .values({
      userId,
      period: 'weekly',
      periodStart: format(start, 'yyyy-MM-dd'),
      periodEnd: format(end, 'yyyy-MM-dd'),
      summary,
      categoryBreakdown: stats.categoryBreakdown,
      insights,
      totalHours: Math.round(stats.totalHours),
      meetingHours: Math.round(stats.meetingHours),
      focusHours: Math.round(stats.focusHours),
    })
    .onConflictDoUpdate({
      target: [reflections.userId, reflections.period, reflections.periodStart],
      set: { summary, categoryBreakdown: stats.categoryBreakdown, insights, generatedAt: new Date() },
    })

  return { summary, insights, stats }
}

export async function generateMonthlyReflection(userId, date = new Date()) {
  const start = startOfMonth(date)
  const end = endOfMonth(date)

  const eventRows = await db
    .select()
    .from(events)
    .where(and(eq(events.userId, userId), gte(events.startAt, start), lt(events.startAt, end)))

  const stats = buildStats(eventRows)

  const patterns = detectPatterns(stats)
  if (stats.totalHours > 0) {
    patterns.push(`Total tracked time for the month: ${stats.totalHours}h.`)
  }

  const recommendations = buildRecommendations(stats)
  const summary = buildSummary(stats, 'monthly', start, end)
  const insights = { patterns, recommendations, score: stats.score }

  await db
    .insert(reflections)
    .values({
      userId,
      period: 'monthly',
      periodStart: format(start, 'yyyy-MM-dd'),
      periodEnd: format(end, 'yyyy-MM-dd'),
      summary,
      categoryBreakdown: stats.categoryBreakdown,
      insights,
      totalHours: Math.round(stats.totalHours),
      meetingHours: Math.round(stats.meetingHours),
      focusHours: Math.round(stats.focusHours),
    })
    .onConflictDoUpdate({
      target: [reflections.userId, reflections.period, reflections.periodStart],
      set: { summary, categoryBreakdown: stats.categoryBreakdown, insights, generatedAt: new Date() },
    })

  return { summary, insights, stats }
}
