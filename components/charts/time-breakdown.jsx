'use client'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { CATEGORY_COLORS, CATEGORY_COLOR_FALLBACK } from '@/lib/constants.js'

function getColor(name, i) {
  return CATEGORY_COLORS[name] ?? CATEGORY_COLOR_FALLBACK[i % CATEGORY_COLOR_FALLBACK.length]
}

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const { name, value } = payload[0]
  const color = getColor(name, 0)
  return (
    <div
      className="px-3 py-2 rounded-xl text-xs font-medium"
      style={{
        background: '#FFFFFF',
        border: '1px solid #E5E5EA',
        boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
      }}
    >
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full" style={{ background: color }} />
        <span style={{ color: '#6E6E73' }}>{name}</span>
        <span className="font-bold" style={{ color: '#1C1C1E' }}>{value}h</span>
      </div>
    </div>
  )
}

function CustomLegend({ payload }) {
  if (!payload?.length) return null
  return (
    <div className="flex flex-wrap justify-center gap-x-3 gap-y-1.5 mt-2 px-2">
      {payload.map((entry) => (
        <div key={entry.value} className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full" style={{ background: entry.color }} />
          <span className="text-xs" style={{ color: '#6E6E73' }}>{entry.value}</span>
        </div>
      ))}
    </div>
  )
}

export default function TimeBreakdownChart({ data }) {
  if (!data?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-sm" style={{ color: 'rgba(255,255,255,0.2)' }}>No data yet</p>
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie
          data={data}
          dataKey="hours"
          nameKey="name"
          cx="50%"
          cy="46%"
          outerRadius={78}
          innerRadius={42}
          strokeWidth={0}
          paddingAngle={2}
        >
          {data.map((entry, i) => (
            <Cell
              key={entry.name}
              fill={getColor(entry.name, i)}
              style={{ filter: `drop-shadow(0 0 6px ${getColor(entry.name, i)}50)` }}
            />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend content={<CustomLegend />} />
      </PieChart>
    </ResponsiveContainer>
  )
}
