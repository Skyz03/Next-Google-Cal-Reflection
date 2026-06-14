'use client'
import { useSyncExternalStore, useState } from 'react'
import { useRouter } from 'next/navigation'

const LAST_SYNC_KEY = 'calendar_reflect_last_sync'

// useSyncExternalStore: server snapshot is always null (no localStorage on server),
// client snapshot reads from localStorage. This prevents hydration mismatches.
function subscribeToLastSync(callback) {
  window.addEventListener('storage', callback)
  return () => window.removeEventListener('storage', callback)
}
function getLastSyncSnapshot() {
  const stored = localStorage.getItem(LAST_SYNC_KEY)
  return stored ? Number(stored) : null
}

function timeAgo(ts) {
  if (!ts) return null
  const diff = Math.floor((Date.now() - ts) / 1000)
  if (diff < 60) return 'just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

export default function SyncButton() {
  const [status, setStatus] = useState('idle')
  const router = useRouter()

  const lastSync = useSyncExternalStore(
    subscribeToLastSync,
    getLastSyncSnapshot,
    () => null  // server snapshot — always null, matches SSR output
  )

  async function handleSync() {
    setStatus('loading')
    try {
      const res = await fetch('/api/sync', { method: 'POST' })
      if (!res.ok) throw new Error('sync failed')
      const now = Date.now()
      localStorage.setItem(LAST_SYNC_KEY, String(now))
      // storage events don't fire for the originating tab, so dispatch manually
      window.dispatchEvent(new StorageEvent('storage', { key: LAST_SYNC_KEY }))
      setStatus('done')
      router.refresh()
      setTimeout(() => setStatus('idle'), 3000)
    } catch {
      setStatus('error')
      setTimeout(() => setStatus('idle'), 4000)
    }
  }

  const config = {
    idle:    { label: 'Sync now',   color: '#5856D6', bg: '#EEF0FB' },
    loading: { label: 'Syncing…',   color: '#5856D6', bg: '#EEF0FB' },
    done:    { label: 'Up to date', color: '#34C759', bg: '#EDFBF2' },
    error:   { label: 'Try again',  color: '#FF3B30', bg: '#FFF0EF' },
  }

  const { label, color, bg } = config[status]
  const ago = timeAgo(lastSync)

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        onClick={handleSync}
        disabled={status === 'loading'}
        className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-opacity duration-150 disabled:opacity-60 cursor-pointer"
        style={{ background: bg, color }}
        aria-label={status === 'loading' ? 'Syncing your calendar' : 'Sync your calendar now'}
      >
        {status === 'loading' ? (
          <svg className="animate-spin" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
            <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
          </svg>
        ) : (
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="1 4 1 10 7 10"/>
            <path d="M3.51 15a9 9 0 1 0 .49-3.41"/>
          </svg>
        )}
        {label}
      </button>
      {ago && status === 'idle' && (
        <span className="text-xs" style={{ color: '#AEAEB2' }}>Updated {ago}</span>
      )}
    </div>
  )
}
