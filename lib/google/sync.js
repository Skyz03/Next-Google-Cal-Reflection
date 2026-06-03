import { google } from 'googleapis'
import { db } from '@/lib/db/index.js'
import { events, users } from '@/lib/db/schema.js'
import { eq } from 'drizzle-orm'
import { getGoogleClient } from './client.js'
import { categoriseEvent } from '@/lib/logic/categorise.js'

export async function syncGoogleCalendar(userId) {
  const oauth2Client = await getGoogleClient(userId)
  const calendar = google.calendar({ version: 'v3', auth: oauth2Client })

  const [user] = await db.select().from(users).where(eq(users.id, userId))
  const syncToken = user.googleSyncToken

  let pageToken = undefined
  let nextSyncToken = null

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

      const upserts = []

      for (const item of items) {
        if (item.status === 'cancelled') continue
        if (!item.start?.dateTime && !item.start?.date) continue

        const isAllDay = Boolean(item.start?.date)
        const startAt = new Date(item.start?.dateTime ?? item.start?.date)
        const endAt = new Date(item.end?.dateTime ?? item.end?.date)

        if (!isAllDay && endAt - startAt < 5 * 60 * 1000) continue

        const category = categoriseEvent({
          title: item.summary ?? '',
          attendeeCount: item.attendees?.length ?? 0,
          calendarName: item.organizer?.displayName ?? '',
        })

        upserts.push(
          db.insert(events).values({
            userId,
            source: 'google',
            externalId: item.id,
            title: item.summary ?? '(no title)',
            startAt,
            endAt,
            category,
            calendarName: item.organizer?.displayName ?? null,
            attendeeCount: item.attendees?.length ?? 0,
            isRecurring: Boolean(item.recurringEventId),
            isAllDay,
            rawMetadata: {
              description: item.description,
              location: item.location,
              status: item.status,
            },
          }).onConflictDoUpdate({
            target: [events.userId, events.externalId],
            set: {
              title: item.summary ?? '(no title)',
              startAt,
              endAt,
              category,
              attendeeCount: item.attendees?.length ?? 0,
              updatedAt: new Date(),
            },
          })
        )
      }

      if (upserts.length > 0) await Promise.all(upserts)

    } while (pageToken)

    if (nextSyncToken) {
      await db.update(users).set({ googleSyncToken: nextSyncToken }).where(eq(users.id, userId))
    }

    return { success: true }

  } catch (err) {
    if (err?.code === 410) {
      await db.update(users).set({ googleSyncToken: null }).where(eq(users.id, userId))
      return syncGoogleCalendar(userId)
    }
    throw err
  }
}
