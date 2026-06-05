'use client'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'

const CATEGORY_COLORS = {
  Health:   '#34D399',
  Meeting:  '#818CF8',
  Work:     '#60A5FA',
  Learning: '#FBBF24',
  Social:   '#F472B6',
  Family:   '#FB923C',
  Admin:    '#A78BFA',
  Other:    '#94A3B8',
}

const FALLBACK = ['#818CF8', '#34D399', '#60A5FA', '#FBBF24', '#F472B6', '#FB923C', '#A78BFA', '#94A3B8']

function getColor(name, i) {
  return CATEGORY_COLORS[name] ?? FALLBACK[i % FALLBACK.length]
}

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const { name, value } = payload[0]
  const color = getColor(name, 0)
  return (
    <div
      className="px-3 py-2 rounded-xl text-xs font-medium"
      style={{
        background: 'rgba(13,21,37,0.95)',
        border: '1px solid rgba(255,255,255,0.12)',
        backdropFilter: 'blur(12px)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
      }}
    >
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full" style={{ background: color }} />
        <span style={{ color: 'rgba(255,255,255,0.6)' }}>{name}</span>
        <span className="font-bold" style={{ color: '#F1F5F9' }}>{value}h</span>
      </div>
    </div>
  )
}

function CustomLegend({ payload }) {
  if (!payload?.length) return null
  return (
    <div className="flex flex-wrap justify-center gap-x-3 gap-y-1.5 mt-2 px-2">
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full" style={{ background: entry.color }} />
          <span className="text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>{entry.value}</span>
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
              key={i}
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
