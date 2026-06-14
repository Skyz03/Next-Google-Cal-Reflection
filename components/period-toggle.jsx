'use client'
import Link from 'next/link'

export default function PeriodToggle({ current }) {
  return (
    <div
      className="flex rounded-xl p-1 text-sm"
      style={{ background: '#E5E5EA' }}
    >
      {['week', 'month'].map((p) => (
        <Link
          key={p}
          href={`/?period=${p}`}
          className="px-3.5 py-1.5 rounded-lg font-medium transition-all duration-150 capitalize"
          style={
            current === p
              ? { background: '#FFFFFF', color: '#1C1C1E', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }
              : { color: '#6E6E73' }
          }
        >
          {p === 'week' ? 'This Week' : 'This Month'}
        </Link>
      ))}
    </div>
  )
}
