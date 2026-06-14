'use client'
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
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

export default function HoursTrendChart({ data }) {
  if (!data?.length) {
    return (
      <div className="flex items-center justify-center h-40">
        <p className="text-sm" style={{ color: '#C7C7CC' }}>Not enough data yet</p>
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={180}>
      <AreaChart data={data} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
        <defs>
          <linearGradient id="hoursGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#5856D6" stopOpacity={0.15} />
            <stop offset="100%" stopColor="#5856D6" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="#F2F2F7" strokeDasharray="0" vertical={false} />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 11, fill: '#AEAEB2' }}
          axisLine={false}
          tickLine={false}
          interval="preserveStartEnd"
        />
        <YAxis
          tick={{ fontSize: 10, fill: '#C7C7CC' }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `${v}h`}
        />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="hours"
          stroke="#5856D6"
          strokeWidth={2}
          fill="url(#hoursGrad)"
          dot={{ r: 3, fill: '#5856D6', stroke: '#FFFFFF', strokeWidth: 2 }}
          activeDot={{ r: 5, fill: '#5856D6', stroke: '#FFFFFF', strokeWidth: 2 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
