import { db } from '@/lib/db/index.js'
import { users } from '@/lib/db/schema.js'
import { inngest } from '@/lib/jobs/inngest.js'
import { NextResponse } from 'next/server'
import { isLastDayOfMonth } from 'date-fns'

export async function GET(request) {
  if (request.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const allUsers = await db.select({ id: users.id }).from(users)
  const isEndOfMonth = isLastDayOfMonth(new Date())

  const jobs = allUsers.flatMap((u) => {
    const batch = [{ name: 'reflection/weekly.requested', data: { userId: u.id } }]
    if (isEndOfMonth) batch.push({ name: 'reflection/monthly.requested', data: { userId: u.id } })
    return batch
  })

  if (jobs.length === 0) return NextResponse.json({ triggered: 0 })

  try {
    await inngest.send(jobs)
    return NextResponse.json({ triggered: jobs.length })
  } catch (err) {
    console.error('[cron/reflect] failed to send jobs to Inngest', err)
    return NextResponse.json({ error: 'Failed to queue reflection jobs.' }, { status: 500 })
  }
}
