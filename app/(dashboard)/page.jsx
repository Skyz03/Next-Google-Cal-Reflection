import { getSessionUserId } from '@/lib/session.js'
import { redirect } from 'next/navigation'
import { getEventSummariesForWeek, getEventSummariesForMonth, getLatestReflection, getLatestAnyReflection } from '@/lib/db/queries.js'
import ReflectionCard from '@/components/reflection-card.jsx'
import TimeBreakdownChart from '@/components/charts/time-breakdown.jsx'
import SyncButton from '@/components/sync-button.jsx'
import CategoryAccordion from '@/components/category-accordion.jsx'
import PeriodToggle from '@/components/period-toggle.jsx'
import StatCard from '@/components/stat-card.jsx'
import { differenceInMinutes } from 'date-fns'
import { buildStats } from '@/lib/logic/stats.js'
import DayActivityChart from '@/components/charts/day-activity-chart.jsx'

function buildBreakdown(events) {
  const breakdown = {}
  for (const e of events) {
    if (e.isAllDay) continue
    const mins = differenceInMinutes(new Date(e.endAt), new Date(e.startAt))
    const cat = e.category ?? 'Other'
    if (!breakdown[cat]) breakdown[cat] = { hours: 0, events: [] }
    breakdown[cat].hours += mins / 60
    breakdown[cat].events.push(e)
  }
  return Object.entries(breakdown)
    .map(([name, data]) => ({
      name,
      hours: Math.round(data.hours * 10) / 10,
      events: data.events.sort((a, b) => new Date(a.startAt) - new Date(b.startAt)),
    }))
    .sort((a, b) => b.hours - a.hours)
}

export default async function OverviewPage({ searchParams }) {
  const params = await searchParams
  const period = params?.period === 'month' ? 'month' : 'week'

  const userId = await getSessionUserId()
  if (!userId) redirect('/login')

  const fetchEvents = period === 'month' ? getEventSummariesForMonth : getEventSummariesForWeek

  const [allEvents, weekReflection, latestReflection] = await Promise.all([
    fetchEvents(userId),
    getLatestReflection(userId, 'weekly'),
    getLatestAnyReflection(userId),
  ])

  const displayReflection = weekReflection ?? latestReflection
  const breakdown = buildBreakdown(allEvents)
  const isFirstRun = allEvents.length === 0 && !latestReflection
  const totalHours = Math.round(breakdown.reduce((sum, b) => sum + b.hours, 0))
  const chartData = breakdown.map(({ name, hours }) => ({ name, hours }))
  const topCategory = breakdown[0]?.name ?? '—'
  const focusHours = breakdown.find(b => b.name === 'Work')?.hours ?? 0
  const balanceScore = displayReflection?.insights?.score ?? null

  // Day-of-week activity: Mon(1)→Sun(0)
  const stats = buildStats(allEvents)
  const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const DAY_ORDER = [1, 2, 3, 4, 5, 6, 0]
  const dayData = DAY_ORDER.map((idx, i) => ({
    day: DAY_LABELS[i],
    hours: Math.round((stats.dayMinutes[idx] / 60) * 10) / 10,
  }))

  const scoreAccent = balanceScore == null
    ? '#AEAEB2'
    : balanceScore >= 70 ? '#34C759'
    : balanceScore >= 40 ? '#FF9500'
    : '#FF3B30'

  return (
    <div className="max-w-5xl">
      {/* First-run onboarding banner */}
      {isFirstRun && (
        <div
          className="rounded-2xl p-5 mb-6 flex items-start gap-4"
          style={{ background: '#EEF0FB', border: '1px solid #D5D4F5' }}
          role="status"
        >
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5" style={{ background: '#5856D6' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="1 4 1 10 7 10"/>
              <path d="M3.51 15a9 9 0 1 0 .49-3.41"/>
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold" style={{ color: '#1C1C1E' }}>Welcome! Let us pull in your calendar.</p>
            <p className="text-sm mt-0.5" style={{ color: '#6E6E73' }}>
              Hit <strong>Sync now</strong> above to import your events. Stats and reflections appear once your first sync is done.
            </p>
          </div>
        </div>
      )}

      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight" style={{ color: '#1C1C1E' }}>
              {period === 'month' ? 'This Month' : 'This Week'}
            </h1>
            <p className="text-sm mt-0.5" style={{ color: '#8E8E93' }}>
              {allEvents.length} events · {totalHours}h tracked
            </p>
          </div>
          <PeriodToggle current={period} />
        </div>
        <SyncButton />
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-4 gap-4 mb-4">
        <StatCard
          label="Total Hours"
          value={`${totalHours}h`}
          sub="tracked this period"
          accent="#5856D6"
        />
        <StatCard
          label="Top Category"
          value={topCategory}
          sub={`${breakdown[0]?.hours ?? 0}h logged`}
          accent="#34C759"
        />
        <StatCard
          label="Focus Time"
          value={`${focusHours}h`}
          sub="deep work sessions"
          accent="#007AFF"
        />
        <StatCard
          label="Balance Score"
          value={balanceScore != null ? `${balanceScore}/100` : '—'}
          sub={
            balanceScore == null ? 'sync to generate'
            : balanceScore >= 70 ? 'great balance'
            : balanceScore >= 40 ? 'room to improve'
            : 'needs attention'
          }
          accent={scoreAccent}
        />
      </div>

      {/* Chart + breakdown */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="rounded-2xl p-6" style={{ background: '#FFFFFF', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#AEAEB2' }}>Time by Category</p>
            <span className="text-xs" style={{ color: '#C7C7CC' }}>{breakdown.length} categories</span>
          </div>
          <TimeBreakdownChart data={chartData} />
        </div>

        <div className="rounded-2xl p-6" style={{ background: '#FFFFFF', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#AEAEB2' }}>Category Breakdown</p>
            <span className="text-xs" style={{ color: '#C7C7CC' }}>{allEvents.length} events</span>
          </div>
          {breakdown.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#C7C7CC" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mb-3" aria-hidden="true">
                <rect x="3" y="4" width="18" height="18" rx="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              <p className="text-sm font-medium" style={{ color: '#8E8E93' }}>No events yet</p>
              <p className="text-xs mt-1" style={{ color: '#C7C7CC' }}>Tap Sync now to pull your calendar</p>
            </div>
          ) : (
            <CategoryAccordion categories={breakdown} />
          )}
        </div>
      </div>

      {/* Day of week activity */}
      <div className="rounded-2xl p-6 mb-4" style={{ background: '#FFFFFF', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#AEAEB2' }}>Activity by Day</p>
            <p className="text-xs mt-0.5" style={{ color: '#C7C7CC' }}>
              {stats.busiestDay ? `Busiest: ${stats.busiestDay}` : 'Which days are you most active?'}
            </p>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ background: '#EEF0FB', color: '#5856D6' }}>
            This {period === 'month' ? 'month' : 'week'}
          </span>
        </div>
        <DayActivityChart data={dayData} busiestDay={stats.busiestDay} />
      </div>

      {/* Reflection card — placeholder when none exists yet */}
      {displayReflection ? (
        <ReflectionCard reflection={displayReflection} />
      ) : (
        <div className="rounded-2xl p-8 flex items-center gap-5" style={{ background: '#FFFFFF', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0" style={{ background: '#F2F2F7' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C7C7CC" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold" style={{ color: '#3C3C43' }}>Your weekly reflection will appear here</p>
            <p className="text-xs mt-1" style={{ color: '#8E8E93' }}>
              Sync your calendar and a personalised summary — patterns, recommendations, and a balance score — will be generated automatically.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
