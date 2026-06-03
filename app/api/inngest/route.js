import { serve } from 'inngest/next'
import { inngest } from '@/lib/jobs/inngest.js'
import { syncUser, generateWeekly, generateMonthly } from '@/lib/jobs/definitions.js'

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [syncUser, generateWeekly, generateMonthly],
})
