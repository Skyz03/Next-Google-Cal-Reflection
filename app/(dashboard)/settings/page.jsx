import { auth } from '@/lib/auth.js'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db/index.js'
import { users } from '@/lib/db/schema.js'
import { eq } from 'drizzle-orm'
import { getSessionUserId } from '@/lib/session.js'
import AppleConnectForm from './apple-connect-form.jsx'

function SettingRow({ label, value, badge }) {
  return (
    <div className="flex items-center justify-between py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
      <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>{label}</p>
      <div className="flex items-center gap-3">
        {value && <p className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.75)' }}>{value}</p>}
        {badge && (
          <span
            className="text-xs font-semibold px-2.5 py-1 rounded-full"
            style={{ background: badge.bg, color: badge.color, border: `1px solid ${badge.color}25` }}
          >
            {badge.label}
          </span>
        )}
      </div>
    </div>
  )
}

export default async function SettingsPage() {
  const session = await auth()
  if (!session?.user) redirect('/login')

  const { email, name, image } = session.user
  const initials = (name ?? email ?? 'U').slice(0, 2).toUpperCase()

  const userId = await getSessionUserId()
  const [dbUser] = userId ? await db.select().from(users).where(eq(users.id, userId)) : [null]
  const appleConnected = Boolean(dbUser?.appleCalDAVUser)

  return (
    <div className="max-w-xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight" style={{ color: '#F1F5F9' }}>Settings</h1>
        <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.3)' }}>Manage your account and integrations</p>
      </div>

      {/* Profile card */}
      <div
        className="rounded-2xl overflow-hidden mb-4"
        style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.07)',
          backdropFilter: 'blur(20px)',
        }}
      >
        {/* Card header bar */}
        <div className="px-6 py-3.5 flex items-center gap-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="w-1 h-3.5 rounded-full" style={{ background: '#6366F1' }} />
          <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.25)' }}>Account</p>
        </div>

        <div className="px-6 py-5">
          {/* User avatar row */}
          <div className="flex items-center gap-4 mb-5 pb-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            {image ? (
              <img src={image} alt={name ?? email} className="w-12 h-12 rounded-full" style={{ boxShadow: '0 0 16px rgba(99,102,241,0.3)' }} />
            ) : (
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0"
                style={{ background: 'linear-gradient(135deg, #6366F1, #8B5CF6)', boxShadow: '0 0 16px rgba(99,102,241,0.35)' }}
              >
                {initials}
              </div>
            )}
            <div>
              {name && <p className="text-sm font-semibold" style={{ color: '#F1F5F9' }}>{name}</p>}
              <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>{email}</p>
            </div>
            <div className="ml-auto">
              <span
                className="text-xs font-semibold px-2.5 py-1 rounded-full"
                style={{ background: 'rgba(52,211,153,0.1)', color: '#34D399', border: '1px solid rgba(52,211,153,0.2)' }}
              >
                Active
              </span>
            </div>
          </div>

          <SettingRow label="Email" value={email} />
          <SettingRow label="Sign-in method" value="Google OAuth" />
          <div className="flex items-center justify-between py-4">
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>Calendar access</p>
            <span
              className="text-xs font-semibold px-2.5 py-1 rounded-full"
              style={{ background: 'rgba(96,165,250,0.1)', color: '#60A5FA', border: '1px solid rgba(96,165,250,0.2)' }}
            >
              Read-only
            </span>
          </div>
        </div>
      </div>

      {/* Integrations card */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.07)',
          backdropFilter: 'blur(20px)',
        }}
      >
        <div className="px-6 py-3.5 flex items-center gap-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="w-1 h-3.5 rounded-full" style={{ background: '#34D399' }} />
          <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.25)' }}>Integrations</p>
        </div>
        <div className="px-6 py-5 flex flex-col gap-5">
          {/* Google Calendar */}
          <div className="flex items-center gap-4">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.75)' }}>Google Calendar</p>
              <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.3)' }}>Syncing events automatically via OAuth</p>
            </div>
            <div className="ml-auto">
              <span
                className="text-xs font-semibold px-2.5 py-1 rounded-full"
                style={{ background: 'rgba(52,211,153,0.1)', color: '#34D399', border: '1px solid rgba(52,211,153,0.2)' }}
              >
                Connected
              </span>
            </div>
          </div>

          {/* Divider */}
          <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)' }} />

          {/* Apple Calendar */}
          <AppleConnectForm
            connected={appleConnected}
            appleUser={dbUser?.appleCalDAVUser ?? null}
          />
        </div>
      </div>
    </div>
  )
}
