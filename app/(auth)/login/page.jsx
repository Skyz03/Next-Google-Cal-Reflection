import { signIn } from '@/lib/auth.js'
import LoginButton from './login-button.jsx'

export default function LoginPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ background: '#06091A' }}
    >
      {/* Ambient blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute rounded-full"
          style={{
            top: '20%', left: '35%', width: '500px', height: '500px',
            background: 'radial-gradient(circle, rgba(99,102,241,0.14) 0%, transparent 70%)',
            filter: 'blur(80px)', transform: 'translate(-50%, -50%)',
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            bottom: '25%', right: '30%', width: '360px', height: '360px',
            background: 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            bottom: '10%', left: '20%', width: '240px', height: '240px',
            background: 'radial-gradient(circle, rgba(52,211,153,0.06) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
      </div>

      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
        }}
      />

      <div className="relative w-full max-w-sm z-10">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
            style={{
              background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
              boxShadow: '0 0 40px rgba(99,102,241,0.45), 0 8px 32px rgba(0,0,0,0.4)',
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
          </div>
          <h1
            className="text-2xl font-bold tracking-tight mb-1"
            style={{ color: '#F1F5F9' }}
          >
            Calendar Reflect
          </h1>
          <p className="text-sm text-center leading-relaxed px-4" style={{ color: 'rgba(255,255,255,0.35)' }}>
            Your calendar tells you what you planned.<br />
            We reveal what your patterns mean.
          </p>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl p-6"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.09)',
            backdropFilter: 'blur(24px)',
            boxShadow: '0 24px 60px rgba(0,0,0,0.4)',
          }}
        >
          <form action={async () => { 'use server'; await signIn('google', { redirectTo: '/' }) }}>
            <LoginButton />
          </form>

          <div className="mt-4 flex items-center gap-3">
            <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}>Secure OAuth 2.0</span>
            <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
          </div>
        </div>

        <p className="text-center text-xs mt-5" style={{ color: 'rgba(255,255,255,0.15)' }}>
          Calendar data stays private · Read-only access
        </p>
      </div>
    </div>
  )
}
