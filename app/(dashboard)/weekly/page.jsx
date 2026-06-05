import { getSessionUserId } from '@/lib/session.js'
import { redirect } from 'next/navigation'
import { getReflectionHistory } from '@/lib/db/queries.js'
import ReflectionCard from '@/components/reflection-card.jsx'

export default async function WeeklyPage() {
  const userId = await getSessionUserId()
  if (!userId) redirect('/login')

  const history = await getReflectionHistory(userId, 'weekly', 8)

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(129,140,248,0.12)', border: '1px solid rgba(129,140,248,0.2)' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#818CF8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight" style={{ color: '#F1F5F9' }}>
              Weekly Reflections
            </h1>
          </div>
        </div>
        <p className="text-sm ml-12" style={{ color: 'rgba(255,255,255,0.3)' }}>
          {history.length > 0 ? `${history.length} weeks of insights` : 'No reflections yet'}
        </p>
      </div>

      {history.length === 0 ? (
        <div
          className="rounded-2xl p-14 text-center"
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.07)',
            backdropFilter: 'blur(20px)',
          }}
        >
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: 'rgba(129,140,248,0.1)', border: '1px solid rgba(129,140,248,0.2)' }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#818CF8" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
          </div>
          <p className="font-semibold text-sm mb-1" style={{ color: 'rgba(255,255,255,0.6)' }}>
            No weekly reflections yet
          </p>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.25)' }}>
            Sync your calendar and check back after a week.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((r) => <ReflectionCard key={r.id} reflection={r} />)}
        </div>
      )}
    </div>
  )
}
