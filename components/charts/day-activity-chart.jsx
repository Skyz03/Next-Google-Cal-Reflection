'use client'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from 'recharts'

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div
      className="px-3 py-2 rounded-xl text-xs font-medium"
      style={{ background: '#FFFFFF', border: '1px solid #E5E5EA', boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }}
    >
      <span style={{ color: '#6E6E73' }}>{label}</span>
      <span className="ml-2 font-bold" style={{ color: '#1C1C1E' }}>{payload[0].value}h</span>
    </div>
  )
}

export default function DayActivityChart({ data, busiestDay }) {
  if (!data?.length || data.every(d => d.hours === 0)) {
    return (
      <div className="flex items-center justify-center h-40">
        <p className="text-sm" style={{ color: '#C7C7CC' }}>No activity this period</p>
      </div>
    )
  }

  const max = Math.max(...data.map(d => d.hours))

  return (
    <ResponsiveContainer width="100%" height={160}>
      <BarChart data={data} barCategoryGap="25%" margin={{ top: 4, right: 0, left: -28, bottom: 0 }}>
        <XAxis
          dataKey="day"
          tick={{ fontSize: 11, fill: '#AEAEB2', fontWeight: 500 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 10, fill: '#C7C7CC' }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `${v}h`}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: '#F2F2F7', radius: 6 }} />
        <Bar dataKey="hours" radius={[5, 5, 0, 0]}>
          {data.map((entry) => (
            <Cell
              key={entry.day}
              fill={entry.hours === max && max > 0 ? '#5856D6' : '#E5E4F7'}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
