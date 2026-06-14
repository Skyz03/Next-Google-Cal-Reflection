export default function StatCard({ label, value, sub, accent }) {
  return (
    <div
      className="rounded-2xl p-5 flex flex-col gap-2"
      style={{
        background: '#FFFFFF',
        boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
        borderLeft: `3px solid ${accent}`,
      }}
    >
      <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#AEAEB2' }}>
        {label}
      </p>
      <p className="text-3xl font-bold tracking-tight leading-none" style={{ color: accent }}>
        {value}
      </p>
      <p className="text-xs" style={{ color: '#8E8E93' }}>{sub}</p>
    </div>
  )
}
