import { db } from '@/lib/db/index.js'
import { users } from '@/lib/db/schema.js'
import { inngest } from '@/lib/jobs/inngest.js'
import { NextResponse } from 'next/server'

export async function GET(request) {
  if (request.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const allUsers = await db.select({ id: users.id }).from(users)
  const jobs = allUsers.map((u) => ({ name: 'calendar/sync.requested', data: { userId: u.id } }))

  if (jobs.length === 0) return NextResponse.json({ triggered: 0 })

  try {
    await inngest.send(jobs)
    return NextResponse.json({ triggered: jobs.length })
  } catch (err) {
    console.error('[cron/sync] failed to send jobs to Inngest', err)
    return NextResponse.json({ error: 'Failed to queue sync jobs.' }, { status: 500 })
  }
}
