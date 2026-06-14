'use client'

export default function Error({ reset }) {
  return (
    <div className="max-w-5xl flex flex-col items-center justify-center py-24 text-center">
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
        style={{ background: '#FFF0EF' }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FF3B30" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
      </div>
      <h2 className="text-lg font-bold mb-2" style={{ color: '#1C1C1E' }}>Something went wrong</h2>
      <p className="text-sm mb-6" style={{ color: '#6E6E73' }}>
        An unexpected error occurred while loading your dashboard.
      </p>
      <button
        onClick={reset}
        className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-opacity hover:opacity-80 cursor-pointer"
        style={{ background: '#EEF0FB', color: '#5856D6' }}
      >
        Try again
      </button>
    </div>
  )
}
