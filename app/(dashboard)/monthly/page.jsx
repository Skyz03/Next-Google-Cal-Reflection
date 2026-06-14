import { getSessionUserId } from '@/lib/session.js'
import { redirect } from 'next/navigation'
import { getReflectionHistory } from '@/lib/db/queries.js'
import ReflectionCard from '@/components/reflection-card.jsx'
import MonthlyHoursChart from '@/components/charts/monthly-hours-chart.jsx'
import { format, parseISO } from 'date-fns'

export const metadata = { title: 'Monthly Reflections — Calendar Reflect' }

export default async function MonthlyPage() {
  const userId = await getSessionUserId()
  if (!userId) redirect('/login')

  const history = await getReflectionHistory(userId, 'monthly', 12)

  // Oldest → newest for the chart
  const chartData = [...history].reverse().map((r) => ({
    label: format(parseISO(r.periodStart), 'MMM yy'),
    hours: r.totalHours ?? 0,
  }))

  const hasChartData = chartData.length >= 2

  return (
    <div className="max-w-4xl">
      <div className="mb-7">
        <h1 className="text-2xl font-bold tracking-tight" style={{ color: '#1C1C1E' }}>
          Monthly Reflections
        </h1>
        <p className="text-sm mt-1" style={{ color: '#8E8E93' }}>
          {history.length > 0 ? `${history.length} months of insights` : 'Reflections generate at the end of each month'}
        </p>
      </div>

      {/* Monthly hours chart */}
      {hasChartData && (
        <div className="rounded-2xl p-6 mb-6" style={{ background: '#FFFFFF', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
          <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: '#AEAEB2' }}>Hours Tracked per Month</p>
          <p className="text-xs mb-4" style={{ color: '#C7C7CC' }}>Peak month highlighted — last {chartData.length} months</p>
          <MonthlyHoursChart data={chartData} />
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
          <p className="font-semibold text-sm mb-1" style={{ color: '#3C3C43' }}>No monthly reflections yet</p>
          <p className="text-sm" style={{ color: '#8E8E93' }}>
            They generate automatically at the end of each month once you have synced data.
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
