'use client'
import { useActionState, useTransition } from 'react'
import { saveAppleCredentials, disconnectApple } from '@/app/actions.js'

export default function AppleConnectForm({ connected, appleUser }) {
  const [state, formAction] = useActionState(saveAppleCredentials, null)
  const [isPending, startTransition] = useTransition()

  if (connected && !state?.success) {
    return (
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: '#F2F2F7' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="#1C1C1E">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold" style={{ color: '#1C1C1E' }}>Apple Calendar</p>
          <p className="text-xs mt-0.5 truncate" style={{ color: '#8E8E93' }}>{appleUser}</p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: '#EDFBF2', color: '#34C759' }}>
            Connected
          </span>
          <button
            onClick={() => startTransition(() => disconnectApple())}
            disabled={isPending}
            className="text-xs px-3 py-1.5 rounded-lg transition-opacity cursor-pointer"
            style={{ background: '#FFF0EF', color: '#FF3B30', opacity: isPending ? 0.5 : 1 }}
          >
            {isPending ? 'Disconnecting…' : 'Disconnect'}
          </button>
        </div>
      </div>
    )
  }

  if (state?.success) {
    return (
      <div className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ background: '#EDFBF2' }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#34C759" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        <p className="text-sm font-medium" style={{ color: '#1C1C1E' }}>Apple Calendar connected successfully.</p>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-5">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: '#F2F2F7' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="#1C1C1E">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
          </svg>
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold" style={{ color: '#1C1C1E' }}>Apple Calendar</p>
          <p className="text-xs mt-0.5" style={{ color: '#8E8E93' }}>Connect via iCloud CalDAV</p>
        </div>
        <span className="text-xs font-medium px-2.5 py-1 rounded-full" style={{ background: '#F2F2F7', color: '#8E8E93' }}>
          Not connected
        </span>
      </div>

      {/* Instruction banner */}
      <div className="rounded-xl p-4 mb-5 text-xs leading-relaxed" style={{ background: '#EEF0FB', color: '#3C3C43' }}>
        Use your Apple ID email and an <strong>app-specific password</strong> — not your regular Apple ID password.
        Generate one at{' '}
        <span style={{ color: '#5856D6' }}>appleid.apple.com → Sign-In &amp; Security → App-Specific Passwords</span>.
      </div>

      <form action={formAction} className="flex flex-col gap-4">
        {/* Apple ID email */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="appleUser" className="text-xs font-semibold" style={{ color: '#6E6E73' }}>
            Apple ID email
          </label>
          <input
            id="appleUser"
            name="appleUser"
            type="email"
            autoComplete="email"
            placeholder="you@icloud.com"
            required
            className="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-colors"
            style={{
              background: '#F2F2F7',
              border: '1px solid #E5E5EA',
              color: '#1C1C1E',
            }}
            onFocus={e => { e.currentTarget.style.borderColor = '#5856D6' }}
            onBlur={e => { e.currentTarget.style.borderColor = '#E5E5EA' }}
          />
        </div>

        {/* App-specific password */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="applePassword" className="text-xs font-semibold" style={{ color: '#6E6E73' }}>
            App-specific password
          </label>
          <input
            id="applePassword"
            name="applePassword"
            type="password"
            autoComplete="current-password"
            placeholder="xxxx-xxxx-xxxx-xxxx"
            required
            className="w-full px-4 py-2.5 rounded-xl text-sm outline-none font-mono transition-colors"
            style={{
              background: '#F2F2F7',
              border: '1px solid #E5E5EA',
              color: '#1C1C1E',
            }}
            onFocus={e => { e.currentTarget.style.borderColor = '#5856D6' }}
            onBlur={e => { e.currentTarget.style.borderColor = '#E5E5EA' }}
          />
        </div>

        {state?.error && (
          <p className="text-xs flex items-center gap-1.5 px-1" style={{ color: '#FF3B30' }} role="alert">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            {state.error}
          </p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full py-2.5 rounded-xl text-sm font-semibold transition-opacity cursor-pointer"
          style={{ background: '#5856D6', color: '#FFFFFF', opacity: isPending ? 0.6 : 1 }}
        >
          {isPending ? 'Connecting…' : 'Connect Apple Calendar'}
        </button>
      </form>
    </div>
  )
}
