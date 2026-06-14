import { getSessionUserId } from '@/lib/session.js'
import { syncGoogleCalendar } from '@/lib/google/sync.js'
import { syncAppleCalendar } from '@/lib/apple/sync.js'
import { generateWeeklyReflection, generateMonthlyReflection } from '@/lib/logic/reflect.js'
import { EVENTS_CACHE_TAG } from '@/lib/db/queries.js'
import { revalidateTag } from 'next/cache'
import { NextResponse } from 'next/server'

// Per-instance cooldown — prevents rapid re-triggers within the same serverless instance.
const SYNC_COOLDOWN_MS = 30_000
const lastSyncMap = new Map()

export async function POST() {
  const userId = await getSessionUserId()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const now = Date.now()
  if (now - (lastSyncMap.get(userId) ?? 0) < SYNC_COOLDOWN_MS) {
    return NextResponse.json({ error: 'Please wait before syncing again.' }, { status: 429 })
  }
  lastSyncMap.set(userId, now)

  try {
    await Promise.all([
      syncGoogleCalendar(userId),
      syncAppleCalendar(userId),
    ])
    await Promise.all([
      generateWeeklyReflection(userId),
      generateMonthlyReflection(userId),
    ])
    revalidateTag(EVENTS_CACHE_TAG)
    return NextResponse.json({ synced: true })
  } catch (err) {
    console.error('[sync] error for user', userId, err)
    return NextResponse.json({ error: 'Sync failed. Please try again.' }, { status: 500 })
  }
}
