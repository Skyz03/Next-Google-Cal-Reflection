export default function Loading() {
  return (
    <div className="max-w-5xl animate-pulse">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="h-7 w-36 rounded-lg mb-2" style={{ background: '#E5E5EA' }} />
          <div className="h-4 w-48 rounded" style={{ background: '#F2F2F7' }} />
        </div>
        <div className="h-9 w-28 rounded-xl" style={{ background: '#E5E5EA' }} />
      </div>

      <div className="grid grid-cols-4 gap-4 mb-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="rounded-2xl h-28" style={{ background: '#FFFFFF', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
            <div className="h-full rounded-2xl" style={{ background: '#F2F2F7' }} />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="rounded-2xl h-72" style={{ background: '#FFFFFF', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }} />
        <div className="rounded-2xl h-72" style={{ background: '#FFFFFF', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }} />
      </div>

      <div className="rounded-2xl h-48" style={{ background: '#FFFFFF', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }} />
    </div>
  )
}
