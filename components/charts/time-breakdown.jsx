'use client'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'

const COLORS = ['#0f172a', '#1e40af', '#15803d', '#b45309', '#9333ea', '#0e7490', '#be185d', '#b91c1c']

export default function TimeBreakdownChart({ data }) {
  if (!data?.length) {
    return <p className="text-sm text-gray-400 text-center py-10">No data yet</p>
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie
          data={data}
          dataKey="hours"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={75}
          strokeWidth={0}
        >
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(v) => [`${v}h`, 'Hours']} />
        <Legend iconType="circle" iconSize={8} />
      </PieChart>
    </ResponsiveContainer>
  )
}
