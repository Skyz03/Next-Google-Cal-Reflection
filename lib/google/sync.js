import { google } from 'googleapis'
import { db } from '@/lib/db/index.js'
import { events, users } from '@/lib/db/schema.js'
import { eq, sql } from 'drizzle-orm'
import { getGoogleClient } from './client.js'
import { mapGoogleEvent } from './mapper.js'

export async function syncGoogleCalendar(userId, _depth = 0) {
  const oauth2Client = await getGoogleClient(userId)
  const calendar = google.calendar({ version: 'v3', auth: oauth2Client })

  const [user] = await db
    .select({ googleSyncToken: users.googleSyncToken })
    .from(users)
    .where(eq(users.id, userId))
  const syncToken = user.googleSyncToken

  let pageToken = undefined
  let nextSyncToken = null
  let totalCount = 0

  try {
    do {
      const params = {
        calendarId: 'primary',
        singleEvents: true,
        maxResults: 250,
        ...(syncToken
          ? { syncToken }
          : {
              timeMin: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
              timeMax: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            }),
        ...(pageToken && { pageToken }),
      }

      const res = await calendar.events.list(params)
      const items = res.data.items ?? []
      nextSyncToken = res.data.nextSyncToken
      pageToken = res.data.nextPageToken

      const values = items.map(item => mapGoogleEvent(item, userId)).filter(Boolean)

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
        totalCount += values.length
      }

    } while (pageToken)

    if (nextSyncToken) {
      await db.update(users).set({ googleSyncToken: nextSyncToken }).where(eq(users.id, userId))
    }

    return { success: true, count: totalCount, source: 'google' }

  } catch (err) {
    if (err?.code === 410 && _depth === 0) {
      await db.update(users).set({ googleSyncToken: null }).where(eq(users.id, userId))
      return syncGoogleCalendar(userId, 1)
    }
    throw err
  }
}
