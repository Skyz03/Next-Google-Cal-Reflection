import { categoriseEvent } from '@/lib/logic/categorise.js'

export function mapAppleEvent(vevent, calendar, userId) {
  if (vevent.type !== 'VEVENT') return null
  if (!vevent.start || !vevent.uid) return null

  const isAllDay = Boolean(vevent.start.dateOnly)
  const startAt = new Date(vevent.start)
  const endAt = vevent.end ? new Date(vevent.end) : startAt

  if (!isAllDay && endAt - startAt < 5 * 60 * 1000) return null

  const attendeeCount = Array.isArray(vevent.attendee)
    ? vevent.attendee.length
    : vevent.attendee ? 1 : 0

  const category = categoriseEvent({
    title: vevent.summary ?? '',
    attendeeCount,
    calendarName: calendar.displayName ?? '',
  })

  return {
    userId,
    source: 'apple',
    externalId: `apple:${vevent.uid}`,
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
  }
}
