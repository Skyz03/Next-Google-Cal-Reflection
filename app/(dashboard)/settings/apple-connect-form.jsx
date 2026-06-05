'use client'
import { useActionState, useTransition } from 'react'
import { saveAppleCredentials, disconnectApple } from '@/app/actions.js'

export default function AppleConnectForm({ connected, appleUser }) {
  const [state, formAction] = useActionState(saveAppleCredentials, null)
  const [isPending, startTransition] = useTransition()

  if (connected && !state?.success) {
    return (
      <div className="flex items-center gap-4">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ color: 'rgba(255,255,255,0.75)' }}>
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
          </svg>
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.75)' }}>Apple Calendar</p>
          <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.3)' }}>{appleUser}</p>
        </div>
        <div className="flex items-center gap-3">
          <span
            className="text-xs font-semibold px-2.5 py-1 rounded-full"
            style={{ background: 'rgba(52,211,153,0.1)', color: '#34D399', border: '1px solid rgba(52,211,153,0.2)' }}
          >
            Connected
          </span>
          <button
            onClick={() => startTransition(() => disconnectApple())}
            disabled={isPending}
            className="text-xs px-3 py-1.5 rounded-lg transition-opacity"
            style={{
              background: 'rgba(239,68,68,0.08)',
              border: '1px solid rgba(239,68,68,0.2)',
              color: '#F87171',
              opacity: isPending ? 0.5 : 1,
            }}
          >
            {isPending ? 'Disconnecting…' : 'Disconnect'}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-5">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ color: 'rgba(255,255,255,0.75)' }}>
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
          </svg>
        </div>
        <div>
          <p className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.75)' }}>Apple Calendar</p>
          <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.3)' }}>Connect via iCloud CalDAV</p>
        </div>
        <span
          className="ml-auto text-xs font-semibold px-2.5 py-1 rounded-full"
          style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.3)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          Not connected
        </span>
      </div>

      <div
        className="rounded-xl p-4 mb-4 text-xs leading-relaxed"
        style={{ background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.15)', color: 'rgba(255,255,255,0.45)' }}
      >
        Use your Apple ID email and an <strong style={{ color: 'rgba(255,255,255,0.6)' }}>app-specific password</strong> — not your Apple ID password.
        Generate one at{' '}
        <span style={{ color: '#818CF8' }}>appleid.apple.com → Sign-In &amp; Security → App-Specific Passwords</span>.
      </div>

      <form action={formAction} className="flex flex-col gap-3">
        <input
          name="appleUser"
          type="email"
          placeholder="Apple ID email"
          required
          className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: 'rgba(255,255,255,0.8)',
          }}
        />
        <input
          name="applePassword"
          type="password"
          placeholder="App-specific password (xxxx-xxxx-xxxx-xxxx)"
          required
          className="w-full px-4 py-2.5 rounded-xl text-sm outline-none font-mono"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: 'rgba(255,255,255,0.8)',
          }}
        />

        {state?.error && (
          <p className="text-xs px-1" style={{ color: '#F87171' }}>{state.error}</p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full py-2.5 rounded-xl text-sm font-semibold transition-opacity"
          style={{
            background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
            color: 'white',
            opacity: isPending ? 0.6 : 1,
          }}
        >
          {isPending ? 'Connecting…' : 'Connect Apple Calendar'}
        </button>
      </form>
    </div>
  )
}
