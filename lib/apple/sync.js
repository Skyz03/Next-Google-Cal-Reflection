import { createDAVClient } from 'tsdav'
import ical from 'node-ical'
import { db } from '@/lib/db/index.js'
import { events, users } from '@/lib/db/schema.js'
import { eq } from 'drizzle-orm'
import { categoriseEvent } from '@/lib/logic/categorise.js'

export async function syncAppleCalendar(userId) {
  const [user] = await db.select().from(users).where(eq(users.id, userId))
  if (!user.appleCalDAVUser || !user.appleCalDAVPassword) return { skipped: true }

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
  const timeMin = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
  const timeMax = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)

  const upserts = []

  for (const calendar of calendars) {
    let objects
    try {
      objects = await client.fetchCalendarObjects({
        calendar,
        timeRange: {
          start: timeMin.toISOString(),
          end: timeMax.toISOString(),
        },
      })
    } catch {
      continue
    }

    for (const obj of objects) {
      if (!obj.data) continue

      const parsed = ical.parseICS(obj.data)

      for (const vevent of Object.values(parsed)) {
        if (vevent.type !== 'VEVENT') continue
        if (!vevent.start || !vevent.uid) continue

        const isAllDay = Boolean(vevent.start.dateOnly)
        const startAt = new Date(vevent.start)
        const endAt = vevent.end ? new Date(vevent.end) : startAt

        if (!isAllDay && endAt - startAt < 5 * 60 * 1000) continue

        const attendeeCount = Array.isArray(vevent.attendee)
          ? vevent.attendee.length
          : vevent.attendee ? 1 : 0

        const category = categoriseEvent({
          title: vevent.summary ?? '',
          attendeeCount,
          calendarName: calendar.displayName ?? '',
        })

        // Prefix to avoid any collision with Google event IDs
        const externalId = `apple:${vevent.uid}`

        upserts.push(
          db.insert(events).values({
            userId,
            source: 'apple',
            externalId,
            title: vevent.summary ?? '(no title)',
            startAt,
            endAt,
            category,
            calendarName: calendar.displayName ?? null,
            attendeeCount,
            isRecurring: Boolean(vevent.rrule),
            isAllDay,
            rawMetadata: {
              description: vevent.description,
              location: vevent.location,
              status: vevent.status,
            },
          }).onConflictDoUpdate({
            target: [events.userId, events.externalId],
            set: {
              title: vevent.summary ?? '(no title)',
              startAt,
              endAt,
              category,
              attendeeCount,
              updatedAt: new Date(),
            },
          })
        )
      }
    }
  }

  if (upserts.length > 0) await Promise.all(upserts)
  return { success: true, count: upserts.length }
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
  } catch (err) {
    return { valid: false, error: err.message }
  }
}
