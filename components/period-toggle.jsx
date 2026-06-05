'use client'
import Link from 'next/link'

export default function PeriodToggle({ current }) {
  return (
    <div
      className="flex rounded-xl p-1 text-sm"
      style={{
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      {['week', 'month'].map((p) => (
        <Link
          key={p}
          href={`/?period=${p}`}
          className="px-3.5 py-1.5 rounded-lg font-medium transition-all duration-150 capitalize"
          style={
            current === p
              ? {
                  background: 'rgba(99,102,241,0.25)',
                  color: '#A5B4FC',
                  boxShadow: 'inset 0 0 0 1px rgba(99,102,241,0.3)',
                }
              : { color: 'rgba(255,255,255,0.3)' }
          }
        >
          {p === 'week' ? 'This Week' : 'This Month'}
        </Link>
      ))}
    </div>
  )
}
