import { format, parseISO } from 'date-fns'

function ScoreBadge({ score }) {
  const { color, bg, label } =
    score >= 70 ? { color: '#34C759', bg: '#EDFBF2', label: 'Great' }
    : score >= 40 ? { color: '#FF9500', bg: '#FFF8EE', label: 'Fair' }
    : { color: '#FF3B30', bg: '#FFF0EF', label: 'Needs work' }
  return (
    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold" style={{ background: bg, color }}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
      {score}/100 · {label}
    </div>
  )
}

export default function ReflectionCard({ reflection }) {
  const insights = reflection.insights ?? {}
  const score = insights.score
  const isMonthly = reflection.period === 'monthly'
  const dateLabel = reflection.periodStart
    ? format(parseISO(reflection.periodStart), isMonthly ? 'MMMM yyyy' : "'Week of' MMM d")
    : null

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: '#FFFFFF', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
      {/* Header */}
      <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid #F2F2F7' }}>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#AEAEB2' }}>
            {isMonthly ? 'Monthly' : 'Weekly'} Reflection
            {dateLabel && <span className="ml-2 font-normal normal-case tracking-normal" style={{ color: '#6E6E73' }}>· {dateLabel}</span>}
          </p>
        </div>
        {score != null && <ScoreBadge score={score} />}
      </div>

      {/* Body */}
      <div className="px-6 py-5">
        {reflection.summary && (
          <p className="text-sm leading-relaxed mb-5" style={{ color: '#3C3C43', lineHeight: '1.65' }}>
            {reflection.summary}
          </p>
        )}

        <div className="grid grid-cols-2 gap-6">
          {insights.patterns?.length > 0 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: '#AEAEB2' }}>Patterns</p>
              <ul className="space-y-2">
                {insights.patterns.map((p) => (
                  <li key={p} className="flex gap-2.5 text-sm" style={{ color: '#3C3C43' }}>
                    <span className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: '#5856D6' }} />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {insights.recommendations?.length > 0 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: '#AEAEB2' }}>Suggestions</p>
              <ul className="space-y-2">
                {insights.recommendations.map((r) => (
                  <li key={r} className="flex gap-2.5 text-sm" style={{ color: '#3C3C43' }}>
                    <span className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: '#34C759' }} />
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
