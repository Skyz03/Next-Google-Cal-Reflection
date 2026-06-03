import { getSessionUserId } from '@/lib/session.js'
import { redirect } from 'next/navigation'
import { getEventsForWeek, getLatestReflection, getLatestAnyReflection } from '@/lib/db/queries.js'
import ReflectionCard from '@/components/reflection-card.jsx'
import TimeBreakdownChart from '@/components/charts/time-breakdown.jsx'
import SyncButton from '@/components/sync-button.jsx'
import { differenceInMinutes } from 'date-fns'

function buildBreakdown(events) {
  const breakdown = {}
  for (const e of events) {
    if (e.isAllDay) continue
    const mins = differenceInMinutes(new Date(e.endAt), new Date(e.startAt))
    const cat = e.category ?? 'Other'
    breakdown[cat] = (breakdown[cat] ?? 0) + mins / 60
  }
  return Object.entries(breakdown).map(([name, hours]) => ({
    name,
    hours: Math.round(hours * 10) / 10,
  }))
}

export default async function OverviewPage() {
  const userId = await getSessionUserId()
  if (!userId) redirect('/login')

  const [weekEvents, weekReflection, latestReflection] = await Promise.all([
    getEventsForWeek(userId),
    getLatestReflection(userId, 'weekly'),
    getLatestAnyReflection(userId),
  ])

  // Prefer the weekly reflection; fall back to whatever exists
  const displayReflection = weekReflection ?? latestReflection

  const breakdown = buildBreakdown(weekEvents)
  const totalHours = breakdown.reduce((sum, b) => sum + b.hours, 0)

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">This week</h1>
          <p className="text-gray-500 mt-1">{weekEvents.length} events · {Math.round(totalHours)}h tracked</p>
        </div>
        <SyncButton />
      </div>

      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h2 className="text-sm font-medium text-gray-500 mb-4">Time by category</h2>
          <TimeBreakdownChart data={breakdown} />
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h2 className="text-sm font-medium text-gray-500 mb-4">Quick stats</h2>
          <div className="space-y-3">
            {breakdown.map((b) => (
              <div key={b.name} className="flex justify-between items-center">
                <span className="text-sm text-gray-700">{b.name}</span>
                <span className="text-sm font-medium text-gray-900">{b.hours}h</span>
              </div>
            ))}
            {breakdown.length === 0 && (
              <p className="text-sm text-gray-400">No events yet — sync your calendar.</p>
            )}
          </div>
        </div>
      </div>

      {displayReflection && <ReflectionCard reflection={displayReflection} />}
    </div>
  )
}
