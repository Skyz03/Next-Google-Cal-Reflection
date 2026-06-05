import { getSessionUserId } from '@/lib/session.js'
import { syncGoogleCalendar } from '@/lib/google/sync.js'
import { syncAppleCalendar } from '@/lib/apple/sync.js'
import { generateWeeklyReflection, generateMonthlyReflection } from '@/lib/logic/reflect.js'
import { NextResponse } from 'next/server'

export async function POST() {
  const userId = await getSessionUserId()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    await Promise.all([
      syncGoogleCalendar(userId),
      syncAppleCalendar(userId),
    ])
    await Promise.all([
      generateWeeklyReflection(userId),
      generateMonthlyReflection(userId),
    ])
    return NextResponse.json({ synced: true })
  } catch (err) {
    console.error('[sync]', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
