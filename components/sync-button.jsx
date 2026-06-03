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
    }
  }

  const labels = { idle: 'Sync calendar', loading: 'Syncing…', done: 'Synced!', error: 'Error — retry' }

  return (
    <button
      onClick={handleSync}
      disabled={status === 'loading'}
      className="px-4 py-2 text-sm font-medium bg-gray-900 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 transition"
    >
      {labels[status]}
    </button>
  )
}
