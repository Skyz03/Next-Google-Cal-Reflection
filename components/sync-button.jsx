'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SyncButton() {
  const [status, setStatus] = useState('idle')
  const router = useRouter()

  async function handleSync() {
    setStatus('loading')
    try {
      const res = await fetch('/api/sync', { method: 'POST' })
      if (!res.ok) throw new Error('sync failed')
      setStatus('done')
      router.refresh()
      setTimeout(() => setStatus('idle'), 3000)
    } catch {
      setStatus('error')
      setTimeout(() => setStatus('idle'), 4000)
    }
  }

  const config = {
    idle:    { label: 'Sync',         bg: 'linear-gradient(135deg, #6366F1, #8B5CF6)', glow: 'rgba(99,102,241,0.4)' },
    loading: { label: 'Syncing…',     bg: 'linear-gradient(135deg, #4F46E5, #7C3AED)', glow: 'rgba(79,70,229,0.4)' },
    done:    { label: '✓ Synced',     bg: 'linear-gradient(135deg, #059669, #10B981)', glow: 'rgba(16,185,129,0.4)' },
    error:   { label: '✕ Retry',      bg: 'linear-gradient(135deg, #DC2626, #EF4444)', glow: 'rgba(239,68,68,0.4)' },
  }

  const { label, bg, glow } = config[status]

  return (
    <button
      onClick={handleSync}
      disabled={status === 'loading'}
      className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white rounded-xl transition-all duration-200 disabled:opacity-60 cursor-pointer"
      style={{
        background: bg,
        boxShadow: `0 4px 20px ${glow}`,
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = `0 6px 28px ${glow}` }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = `0 4px 20px ${glow}` }}
    >
      {status === 'loading' ? (
        <svg className="animate-spin" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
          <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
        </svg>
      ) : (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="1 4 1 10 7 10"/>
          <path d="M3.51 15a9 9 0 1 0 .49-3.41"/>
        </svg>
      )}
      {label}
    </button>
  )
}
