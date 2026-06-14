import { getSessionUserId } from '@/lib/session.js'
import { redirect } from 'next/navigation'
import { getReflectionHistory } from '@/lib/db/queries.js'
import ReflectionCard from '@/components/reflection-card.jsx'
import HoursTrendChart from '@/components/charts/hours-trend-chart.jsx'
import ScoreTrendChart from '@/components/charts/score-trend-chart.jsx'
import { format, parseISO } from 'date-fns'

export const metadata = { title: 'Weekly Reflections — Calendar Reflect' }

export default async function WeeklyPage() {
  const userId = await getSessionUserId()
  if (!userId) redirect('/login')

  const history = await getReflectionHistory(userId, 'weekly', 8)

  // Oldest → newest for the charts
  const trendData = [...history].reverse().map((r) => ({
    label: format(parseISO(r.periodStart), 'MMM d'),
    hours: r.totalHours ?? 0,
    score: r.insights?.score ?? null,
  }))

  const hasChartData = trendData.length >= 2

  return (
    <div className="max-w-4xl">
      <div className="mb-7">
        <h1 className="text-2xl font-bold tracking-tight" style={{ color: '#1C1C1E' }}>
          Weekly Reflections
        </h1>
        <p className="text-sm mt-1" style={{ color: '#8E8E93' }}>
          {history.length > 0 ? `${history.length} weeks of insights` : 'Reflections generate after each sync'}
        </p>
      </div>

      {/* Trend charts — only show with 2+ data points */}
      {hasChartData && (
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* Hours trend */}
          <div className="rounded-2xl p-6" style={{ background: '#FFFFFF', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
            <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: '#AEAEB2' }}>Hours Tracked</p>
            <p className="text-xs mb-4" style={{ color: '#C7C7CC' }}>Total time per week</p>
            <HoursTrendChart data={trendData} />
          </div>

          {/* Score trend */}
          <div className="rounded-2xl p-6" style={{ background: '#FFFFFF', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
            <div className="flex items-start justify-between mb-1">
              <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#AEAEB2' }}>Balance Score</p>
            </div>
            <p className="text-xs mb-4" style={{ color: '#C7C7CC' }}>
              Score per week — green line = 70, orange = 40
            </p>
            <ScoreTrendChart data={trendData} />
          </div>
        </div>
      )}

      {/* Reflection cards */}
      {history.length === 0 ? (
        <div className="rounded-2xl p-14 text-center" style={{ background: '#FFFFFF', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#C7C7CC" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-4" aria-hidden="true">
            <rect x="3" y="4" width="18" height="18" rx="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          <p className="font-semibold text-sm mb-1" style={{ color: '#3C3C43' }}>No weekly reflections yet</p>
          <p className="text-sm" style={{ color: '#8E8E93' }}>
            Sync your calendar from the Overview and check back after your first week.
          </p>
        </div>
      ) : (
        <div>
          {hasChartData && (
            <p className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: '#AEAEB2' }}>Reflection History</p>
          )}
          <div className="space-y-4">
            {history.map((r) => <ReflectionCard key={r.id} reflection={r} />)}
          </div>
        </div>
      )}
    </div>
  )
}
