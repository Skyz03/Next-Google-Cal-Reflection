import { inngest } from './inngest.js'
import { syncGoogleCalendar } from '@/lib/google/sync.js'
import { generateWeeklyReflection, generateMonthlyReflection } from '@/lib/logic/reflect.js'

export const syncUser = inngest.createFunction(
  { id: 'sync-user-calendar', retries: 3, triggers: [{ event: 'calendar/sync.requested' }] },
  async ({ event }) => {
    const { userId } = event.data
    if (!userId) return { skipped: true, reason: 'missing userId' }
    await syncGoogleCalendar(userId)
    return { synced: true, userId }
  }
)

export const generateWeekly = inngest.createFunction(
  { id: 'generate-weekly-reflection', retries: 2, triggers: [{ event: 'reflection/weekly.requested' }] },
  async ({ event }) => {
    const { userId } = event.data
    if (!userId) return { skipped: true, reason: 'missing userId' }
    const result = await generateWeeklyReflection(userId)
    return { generated: true, userId, summary: result?.summary }
  }
)

export const generateMonthly = inngest.createFunction(
  { id: 'generate-monthly-reflection', retries: 2, triggers: [{ event: 'reflection/monthly.requested' }] },
  async ({ event }) => {
    const { userId } = event.data
    if (!userId) return { skipped: true, reason: 'missing userId' }
    await generateMonthlyReflection(userId)
    return { generated: true, userId }
  }
)
