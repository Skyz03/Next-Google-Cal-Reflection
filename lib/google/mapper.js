import { categoriseEvent } from '@/lib/logic/categorise.js'

export function mapGoogleEvent(item, userId) {
  if (item.status === 'cancelled') return null
  if (!item.start?.dateTime && !item.start?.date) return null

  const isAllDay = Boolean(item.start?.date)
  const startAt = new Date(item.start?.dateTime ?? item.start?.date)
  const endAt = new Date(item.end?.dateTime ?? item.end?.date)

  if (!isAllDay && endAt - startAt < 5 * 60 * 1000) return null

  const category = categoriseEvent({
    title: item.summary ?? '',
    attendeeCount: item.attendees?.length ?? 0,
    calendarName: item.organizer?.displayName ?? '',
  })

  return {
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
  }
}
