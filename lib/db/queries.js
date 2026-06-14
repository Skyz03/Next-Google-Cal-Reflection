import { db } from './index.js'
import { events, reflections } from './schema.js'
import { and, eq, gte, lt, desc } from 'drizzle-orm'
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns'
import { unstable_cache } from 'next/cache'

export const EVENTS_CACHE_TAG = 'calendar-events'

const EVENT_SUMMARY_COLUMNS = {
  id: events.id,
  title: events.title,
  startAt: events.startAt,
  endAt: events.endAt,
  category: events.category,
  isAllDay: events.isAllDay,
  attendeeCount: events.attendeeCount,
}

const _cachedWeekSummaries = unstable_cache(
  async (userId, startIso, endIso) =>
    db.select(EVENT_SUMMARY_COLUMNS).from(events).where(
      and(eq(events.userId, userId), gte(events.startAt, new Date(startIso)), lt(events.startAt, new Date(endIso)))
    ),
  ['event-summaries-week'],
  { revalidate: 300, tags: [EVENTS_CACHE_TAG] }
)

const _cachedMonthSummaries = unstable_cache(
  async (userId, startIso, endIso) =>
    db.select(EVENT_SUMMARY_COLUMNS).from(events).where(
      and(eq(events.userId, userId), gte(events.startAt, new Date(startIso)), lt(events.startAt, new Date(endIso)))
    ),
  ['event-summaries-month'],
  { revalidate: 300, tags: [EVENTS_CACHE_TAG] }
)

export async function getEventSummariesForWeek(userId, date = new Date()) {
  const start = startOfWeek(date, { weekStartsOn: 1 })
  const end = endOfWeek(date, { weekStartsOn: 1 })
  return _cachedWeekSummaries(userId, start.toISOString(), end.toISOString())
}

export async function getEventSummariesForMonth(userId, date = new Date()) {
  const start = startOfMonth(date)
  const end = endOfMonth(date)
  return _cachedMonthSummaries(userId, start.toISOString(), end.toISOString())
}

const _cachedLatestReflection = unstable_cache(
  async (userId, period) => {
    const [row] = await db
      .select()
      .from(reflections)
      .where(and(eq(reflections.userId, userId), eq(reflections.period, period)))
      .orderBy(desc(reflections.periodStart))
      .limit(1)
    return row ?? null
  },
  ['latest-reflection'],
  { revalidate: 300, tags: [EVENTS_CACHE_TAG] }
)

export async function getLatestReflection(userId, period) {
  return _cachedLatestReflection(userId, period)
}

const _cachedLatestAnyReflection = unstable_cache(
  async (userId) => {
    const [row] = await db
      .select()
      .from(reflections)
      .where(eq(reflections.userId, userId))
      .orderBy(desc(reflections.generatedAt))
      .limit(1)
    return row ?? null
  },
  ['latest-any-reflection'],
  { revalidate: 300, tags: [EVENTS_CACHE_TAG] }
)

export async function getLatestAnyReflection(userId) {
  return _cachedLatestAnyReflection(userId)
}

export async function getReflectionHistory(userId, period, limit = 12) {
  return db
    .select()
    .from(reflections)
    .where(and(eq(reflections.userId, userId), eq(reflections.period, period)))
    .orderBy(desc(reflections.periodStart))
    .limit(limit)
}
