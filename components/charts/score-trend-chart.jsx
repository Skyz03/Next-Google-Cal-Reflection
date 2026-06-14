'use client'
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine,
} from 'recharts'

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length || payload[0].value == null) return null
  const score = payload[0].value
  const color = score >= 70 ? '#34C759' : score >= 40 ? '#FF9500' : '#FF3B30'
  return (
    <div
      className="px-3 py-2 rounded-xl text-xs font-medium"
      style={{ background: '#FFFFFF', border: '1px solid #E5E5EA', boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }}
    >
      <p style={{ color: '#6E6E73' }}>{label}</p>
      <p className="font-bold mt-0.5" style={{ color }}>{score}/100 balance</p>
    </div>
  )
}

function colorForScore(score) {
  if (score == null) return '#C7C7CC'
  if (score >= 70) return '#34C759'
  if (score >= 40) return '#FF9500'
  return '#FF3B30'
}

export default function ScoreTrendChart({ data }) {
  if (!data?.length || data.every(d => d.score == null)) {
    return (
      <div className="flex items-center justify-center h-40">
        <p className="text-sm" style={{ color: '#C7C7CC' }}>Not enough data yet</p>
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={180}>
      <LineChart data={data} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
        <CartesianGrid stroke="#F2F2F7" strokeDasharray="0" vertical={false} />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 11, fill: '#AEAEB2' }}
          axisLine={false}
          tickLine={false}
          interval="preserveStartEnd"
        />
        <YAxis
          domain={[0, 100]}
          tick={{ fontSize: 10, fill: '#C7C7CC' }}
          axisLine={false}
          tickLine={false}
          ticks={[0, 40, 70, 100]}
        />
        <ReferenceLine y={70} stroke="#34C759" strokeDasharray="4 3" strokeWidth={1} strokeOpacity={0.5} />
        <ReferenceLine y={40} stroke="#FF9500" strokeDasharray="4 3" strokeWidth={1} strokeOpacity={0.5} />
        <Tooltip content={<CustomTooltip />} />
        <Line
          type="monotone"
          dataKey="score"
          stroke="#5856D6"
          strokeWidth={2}
          dot={(props) => {
            const { cx, cy, payload } = props
            if (payload.score == null) return null
            return (
              <circle
                key={`dot-${cx}-${cy}`}
                cx={cx} cy={cy} r={4}
                fill={colorForScore(payload.score)}
                stroke="#FFFFFF"
                strokeWidth={2}
              />
            )
          }}
          activeDot={{ r: 6, stroke: '#FFFFFF', strokeWidth: 2 }}
          connectNulls={false}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
