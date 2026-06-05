import { format, parseISO } from 'date-fns'

function ScoreBadge({ score }) {
  const { color, bg, label } =
    score >= 70 ? { color: '#34D399', bg: 'rgba(52,211,153,0.12)', label: 'Great' }
    : score >= 40 ? { color: '#FBBF24', bg: 'rgba(251,191,36,0.12)', label: 'Fair' }
    : { color: '#F87171', bg: 'rgba(248,113,113,0.12)', label: 'Low' }
  return (
    <div
      className="flex items-center gap-2 px-3 py-1.5 rounded-xl"
      style={{ background: bg, border: `1px solid ${color}25` }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: color, boxShadow: `0 0 6px ${color}` }} />
      <span className="text-sm font-bold" style={{ color }}>{score}/100</span>
      <span className="text-xs" style={{ color: `${color}90` }}>{label}</span>
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

  const accentColor = isMonthly ? '#818CF8' : '#34D399'
  const accentBg = isMonthly ? 'rgba(129,140,248,0.1)' : 'rgba(52,211,153,0.1)'

  return (
    <div
      className="rounded-2xl overflow-hidden transition-all duration-200"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.07)',
        backdropFilter: 'blur(20px)',
      }}
    >
      {/* Top accent bar */}
      <div className="h-px" style={{ background: `linear-gradient(90deg, ${accentColor}60, transparent)` }} />

      {/* Header */}
      <div
        className="px-6 py-4 flex items-center justify-between"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: accentBg, border: `1px solid ${accentColor}25` }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
            </svg>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.25)' }}>
              {isMonthly ? 'Monthly' : 'Weekly'} Reflection
            </p>
            {dateLabel && (
              <p className="text-sm font-semibold mt-0.5" style={{ color: 'rgba(255,255,255,0.8)' }}>{dateLabel}</p>
            )}
          </div>
        </div>
        {score != null && <ScoreBadge score={score} />}
      </div>

      {/* Body */}
      <div className="px-6 py-5">
        {reflection.summary && (
          <p className="text-sm leading-relaxed mb-5" style={{ color: 'rgba(255,255,255,0.55)', lineHeight: '1.7' }}>
            {reflection.summary}
          </p>
        )}

        <div className="grid grid-cols-2 gap-5">
          {insights.patterns?.length > 0 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'rgba(255,255,255,0.2)' }}>
                Patterns
              </p>
              <ul className="space-y-2.5">
                {insights.patterns.map((p, i) => (
                  <li key={i} className="flex gap-2.5 text-sm" style={{ color: 'rgba(255,255,255,0.55)' }}>
                    <span
                      className="w-4 h-4 rounded flex items-center justify-center shrink-0 mt-0.5"
                      style={{ background: 'rgba(129,140,248,0.12)', border: '1px solid rgba(129,140,248,0.2)' }}
                    >
                      <svg width="7" height="7" viewBox="0 0 24 24" fill="none" stroke="#818CF8" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 18 15 12 9 6"/>
                      </svg>
                    </span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {insights.recommendations?.length > 0 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'rgba(255,255,255,0.2)' }}>
                Suggestions
              </p>
              <ul className="space-y-2.5">
                {insights.recommendations.map((r, i) => (
                  <li key={i} className="flex gap-2.5 text-sm" style={{ color: 'rgba(255,255,255,0.55)' }}>
                    <span
                      className="w-4 h-4 rounded flex items-center justify-center shrink-0 mt-0.5"
                      style={{ background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.2)' }}
                    >
                      <svg width="7" height="7" viewBox="0 0 24 24" fill="none" stroke="#34D399" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    </span>
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
