import { db } from './index.js'
import { events, reflections } from './schema.js'
import { and, eq, gte, lt, desc } from 'drizzle-orm'
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns'

export async function getEventsForWeek(userId, date = new Date()) {
  const start = startOfWeek(date, { weekStartsOn: 1 })
  const end = endOfWeek(date, { weekStartsOn: 1 })
  return db.select().from(events).where(
    and(eq(events.userId, userId), gte(events.startAt, start), lt(events.startAt, end))
  )
}

export async function getEventsForMonth(userId, date = new Date()) {
  const start = startOfMonth(date)
  const end = endOfMonth(date)
  return db.select().from(events).where(
    and(eq(events.userId, userId), gte(events.startAt, start), lt(events.startAt, end))
  )
}

export async function getLatestReflection(userId, period) {
  const [row] = await db
    .select()
    .from(reflections)
    .where(and(eq(reflections.userId, userId), eq(reflections.period, period)))
    .orderBy(desc(reflections.periodStart))
    .limit(1)
  return row ?? null
}

export async function getReflectionHistory(userId, period, limit = 12) {
  return db
    .select()
    .from(reflections)
    .where(and(eq(reflections.userId, userId), eq(reflections.period, period)))
    .orderBy(desc(reflections.periodStart))
    .limit(limit)
}

export async function getLatestAnyReflection(userId) {
  const [row] = await db
    .select()
    .from(reflections)
    .where(eq(reflections.userId, userId))
    .orderBy(desc(reflections.generatedAt))
    .limit(1)
  return row ?? null
}
