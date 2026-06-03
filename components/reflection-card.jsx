import { format, parseISO } from 'date-fns'

export default function ReflectionCard({ reflection }) {
  const insights = reflection.insights ?? {}
  const score = insights.score
  const dateLabel = reflection.periodStart
    ? format(parseISO(reflection.periodStart), reflection.period === 'monthly' ? 'MMMM yyyy' : "'Week of' MMM d")
    : null

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">
            {reflection.period === 'monthly' ? 'Monthly' : 'Weekly'} reflection
          </p>
          {dateLabel && <p className="text-sm font-medium text-gray-700 mt-0.5">{dateLabel}</p>}
        </div>
        {score != null && (
          <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
            Balance score: {score}/100
          </span>
        )}
      </div>

      {reflection.summary && (
        <p className="text-gray-700 text-sm leading-relaxed mb-5">{reflection.summary}</p>
      )}

      {insights.patterns?.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">Patterns</p>
          <ul className="space-y-1.5">
            {insights.patterns.map((p, i) => (
              <li key={i} className="text-sm text-gray-700 flex gap-2">
                <span className="text-gray-300 mt-0.5 shrink-0">→</span>{p}
              </li>
            ))}
          </ul>
        </div>
      )}

      {insights.recommendations?.length > 0 && (
        <div>
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">Suggestions</p>
          <ul className="space-y-1.5">
            {insights.recommendations.map((r, i) => (
              <li key={i} className="text-sm text-gray-700 flex gap-2">
                <span className="text-green-400 mt-0.5 shrink-0">✓</span>{r}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
