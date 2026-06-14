import { createDAVClient } from 'tsdav'
import ical from 'node-ical'
import { db } from '@/lib/db/index.js'
import { events, users } from '@/lib/db/schema.js'
import { eq, sql } from 'drizzle-orm'
import { mapAppleEvent } from './mapper.js'

export async function syncAppleCalendar(userId) {
  const [user] = await db
    .select({ appleCalDAVUser: users.appleCalDAVUser, appleCalDAVPassword: users.appleCalDAVPassword })
    .from(users)
    .where(eq(users.id, userId))
  if (!user.appleCalDAVUser || !user.appleCalDAVPassword) return { success: true, count: 0, source: 'apple' }

  const client = await createDAVClient({
    serverUrl: 'https://caldav.icloud.com',
    credentials: {
      username: user.appleCalDAVUser,
      password: user.appleCalDAVPassword,
    },
    authMethod: 'Basic',
    defaultAccountType: 'caldav',
  })

  const calendars = await client.fetchCalendars()
  const timeRange = {
    start: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  }

  const fetchResults = await Promise.allSettled(
    calendars.map(calendar => client.fetchCalendarObjects({ calendar, timeRange }))
  )

  const values = []
  for (let i = 0; i < fetchResults.length; i++) {
    const result = fetchResults[i]
    if (result.status === 'rejected') continue
    const calendar = calendars[i]
    for (const obj of result.value) {
      if (!obj.data) continue
      const parsed = ical.parseICS(obj.data)
      for (const vevent of Object.values(parsed)) {
        const mapped = mapAppleEvent(vevent, calendar, userId)
        if (mapped) values.push(mapped)
      }
    }
  }

  if (values.length > 0) {
    await db.insert(events).values(values).onConflictDoUpdate({
      target: [events.userId, events.externalId],
      set: {
        title: sql`excluded.title`,
        startAt: sql`excluded.start_at`,
        endAt: sql`excluded.end_at`,
        category: sql`excluded.category`,
        attendeeCount: sql`excluded.attendee_count`,
        updatedAt: new Date(),
      },
    })
  }

  return { success: true, count: values.length, source: 'apple' }
}

export async function validateAppleCredentials(username, password) {
  try {
    const client = await createDAVClient({
      serverUrl: 'https://caldav.icloud.com',
      credentials: { username, password },
      authMethod: 'Basic',
      defaultAccountType: 'caldav',
    })
    await client.fetchCalendars()
    return { valid: true }
  } catch {
    return { valid: false, error: 'Could not connect to iCloud. Check your credentials.' }
  }
}
