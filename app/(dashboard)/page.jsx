import { getSessionUserId } from '@/lib/session.js'
import { redirect } from 'next/navigation'
import { getEventsForWeek, getEventsForMonth, getLatestReflection, getLatestAnyReflection } from '@/lib/db/queries.js'
import ReflectionCard from '@/components/reflection-card.jsx'
import TimeBreakdownChart from '@/components/charts/time-breakdown.jsx'
import SyncButton from '@/components/sync-button.jsx'
import CategoryAccordion from '@/components/category-accordion.jsx'
import PeriodToggle from '@/components/period-toggle.jsx'
import StatCard from '@/components/stat-card.jsx'
import { differenceInMinutes } from 'date-fns'

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
      events: data.events,
    }))
    .sort((a, b) => b.hours - a.hours)
}

export default async function OverviewPage({ searchParams }) {
  const params = await searchParams
  const period = params?.period === 'month' ? 'month' : 'week'

  const userId = await getSessionUserId()
  if (!userId) redirect('/login')

  const fetchEvents = period === 'month' ? getEventsForMonth : getEventsForWeek

  const [allEvents, weekReflection, latestReflection] = await Promise.all([
    fetchEvents(userId),
    getLatestReflection(userId, 'weekly'),
    getLatestAnyReflection(userId),
  ])

  const displayReflection = weekReflection ?? latestReflection
  const breakdown = buildBreakdown(allEvents)
  const totalHours = Math.round(breakdown.reduce((sum, b) => sum + b.hours, 0))
  const chartData = breakdown.map(({ name, hours }) => ({ name, hours }))
  const topCategory = breakdown[0]?.name ?? '—'
  const meetingHours = breakdown.find(b => b.name === 'Meeting')?.hours ?? 0
  const focusHours = breakdown.find(b => b.name === 'Work')?.hours ?? 0
  const balanceScore = displayReflection?.insights?.score ?? null

  return (
    <div className="max-w-5xl">
      {/* Page header */}
      <div className="flex items-center justify-between mb-7">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight" style={{ color: '#F1F5F9' }}>
              {period === 'month' ? 'This Month' : 'This Week'}
            </h1>
            <p className="text-sm mt-0.5" style={{ color: 'rgba(255,255,255,0.3)' }}>
              {allEvents.length} events · {totalHours}h tracked
            </p>
          </div>
          <PeriodToggle current={period} />
        </div>
        <SyncButton />
      </div>

      {/* Bento row 1 — stat cards */}
      <div className="grid grid-cols-4 gap-4 mb-4">
        <StatCard
          label="Total Hours"
          value={`${totalHours}h`}
          sub="tracked this period"
          accent="#6366F1"
          icon={<ClockIcon />}
        />
        <StatCard
          label="Top Category"
          value={topCategory}
          sub={`${breakdown[0]?.hours ?? 0}h logged`}
          accent="#34D399"
          icon={<TagIcon />}
        />
        <StatCard
          label="Focus Time"
          value={`${focusHours}h`}
          sub="deep work sessions"
          accent="#60A5FA"
          icon={<FocusIcon />}
        />
        <StatCard
          label="Balance Score"
          value={balanceScore != null ? `${balanceScore}/100` : '—'}
          sub={balanceScore == null ? 'sync to generate' : balanceScore >= 70 ? 'great balance' : balanceScore >= 40 ? 'room to improve' : 'needs attention'}
          accent={balanceScore == null ? '#475569' : balanceScore >= 70 ? '#34D399' : balanceScore >= 40 ? '#FBBF24' : '#F87171'}
          icon={<ScoreIcon />}
        />
      </div>

      {/* Bento row 2 — chart + accordion */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* Chart card */}
        <div
          className="rounded-2xl p-6"
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.07)',
            backdropFilter: 'blur(20px)',
          }}
        >
          <div className="flex items-center justify-between mb-5">
            <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.3)' }}>
              Time by Category
            </p>
            <div className="text-xs font-mono px-2 py-1 rounded-lg" style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.4)' }}>
              {breakdown.length} cats
            </div>
          </div>
          <TimeBreakdownChart data={chartData} />
        </div>

        {/* Accordion card */}
        <div
          className="rounded-2xl p-6"
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.07)',
            backdropFilter: 'blur(20px)',
          }}
        >
          <div className="flex items-center justify-between mb-5">
            <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.3)' }}>
              Category Breakdown
            </p>
            <div className="text-xs font-mono px-2 py-1 rounded-lg" style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.4)' }}>
              {allEvents.length} events
            </div>
          </div>
          {breakdown.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center mb-3" style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.2)' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#818CF8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
              </div>
              <p className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.5)' }}>No events yet</p>
              <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.2)' }}>Hit sync to pull your calendar</p>
            </div>
          ) : (
            <CategoryAccordion categories={breakdown} />
          )}
        </div>
      </div>

      {/* Reflection card */}
      {displayReflection && <ReflectionCard reflection={displayReflection} />}
    </div>
  )
}

/* ── Inline SVG icons ── */
function ClockIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  )
}
function TagIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/>
    </svg>
  )
}
function FocusIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/>
    </svg>
  )
}
function ScoreIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
    </svg>
  )
}
