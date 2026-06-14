import { db } from '@/lib/db/index.js'
import { events, reflections } from '@/lib/db/schema.js'
import { and, eq, gte, lt } from 'drizzle-orm'
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, format } from 'date-fns'
import { buildStats } from './stats.js'
import { detectPatterns, buildRecommendations, buildSummary } from './insights.js'

const REFLECT_COLUMNS = {
  isAllDay: events.isAllDay,
  startAt: events.startAt,
  endAt: events.endAt,
  category: events.category,
}

export async function generateWeeklyReflection(userId, date = new Date()) {
  const start = startOfWeek(date, { weekStartsOn: 1 })
  const end = endOfWeek(date, { weekStartsOn: 1 })

  const eventRows = await db
    .select(REFLECT_COLUMNS)
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
    .select(REFLECT_COLUMNS)
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
