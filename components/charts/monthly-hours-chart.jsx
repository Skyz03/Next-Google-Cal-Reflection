'use client'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell,
} from 'recharts'

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div
      className="px-3 py-2 rounded-xl text-xs font-medium"
      style={{ background: '#FFFFFF', border: '1px solid #E5E5EA', boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }}
    >
      <p style={{ color: '#6E6E73' }}>{label}</p>
      <p className="font-bold mt-0.5" style={{ color: '#5856D6' }}>{payload[0].value}h tracked</p>
    </div>
  )
}

export default function MonthlyHoursChart({ data }) {
  if (!data?.length) {
    return (
      <div className="flex items-center justify-center h-40">
        <p className="text-sm" style={{ color: '#C7C7CC' }}>Not enough data yet</p>
      </div>
    )
  }

  const max = Math.max(...data.map(d => d.hours))

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} barCategoryGap="30%" margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
        <CartesianGrid stroke="#F2F2F7" strokeDasharray="0" vertical={false} />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 11, fill: '#AEAEB2' }}
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
              key={entry.label}
              fill={entry.hours === max && max > 0 ? '#5856D6' : '#E5E4F7'}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
