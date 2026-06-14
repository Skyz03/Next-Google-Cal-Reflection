import Image from 'next/image'
import { auth } from '@/lib/auth.js'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db/index.js'
import { users } from '@/lib/db/schema.js'
import { eq } from 'drizzle-orm'
import { getSessionUserId } from '@/lib/session.js'
import AppleConnectForm from './apple-connect-form.jsx'

export const metadata = {
  title: 'Settings — Calendar Reflect',
}

function SettingRow({ label, value }) {
  return (
    <div className="flex items-center justify-between py-3.5" style={{ borderBottom: '1px solid #F2F2F7' }}>
      <p className="text-sm" style={{ color: '#6E6E73' }}>{label}</p>
      {value && <p className="text-sm font-medium" style={{ color: '#1C1C1E' }}>{value}</p>}
    </div>
  )
}

function Badge({ label, color, bg }) {
  return (
    <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: bg, color }}>
      {label}
    </span>
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
      <div className="mb-7">
        <h1 className="text-2xl font-bold tracking-tight" style={{ color: '#1C1C1E' }}>Settings</h1>
        <p className="text-sm mt-1" style={{ color: '#8E8E93' }}>Manage your account and integrations</p>
      </div>

      {/* Account card */}
      <div className="rounded-2xl overflow-hidden mb-4" style={{ background: '#FFFFFF', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
        <div className="px-6 py-3.5 flex items-center gap-2" style={{ borderBottom: '1px solid #F2F2F7' }}>
          <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#AEAEB2' }}>Account</p>
        </div>

        <div className="px-6 py-5">
          {/* User avatar row */}
          <div className="flex items-center gap-4 mb-4 pb-4" style={{ borderBottom: '1px solid #F2F2F7' }}>
            {image ? (
              <Image
                src={image}
                alt={name ?? email ?? 'Profile'}
                width={48}
                height={48}
                className="rounded-full"
              />
            ) : (
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0"
                style={{ background: 'linear-gradient(135deg, #5856D6, #7876E0)' }}
              >
                {initials}
              </div>
            )}
            <div className="flex-1 min-w-0">
              {name && <p className="text-sm font-semibold" style={{ color: '#1C1C1E' }}>{name}</p>}
              <p className="text-sm" style={{ color: '#6E6E73' }}>{email}</p>
            </div>
            <Badge label="Active" color="#34C759" bg="#EDFBF2" />
          </div>

          <SettingRow label="Email" value={email} />
          <SettingRow label="Sign-in method" value="Google OAuth" />
          <div className="flex items-center justify-between py-3.5">
            <p className="text-sm" style={{ color: '#6E6E73' }}>Calendar access</p>
            <Badge label="Read-only" color="#007AFF" bg="#EBF5FF" />
          </div>
        </div>
      </div>

      {/* Integrations card */}
      <div className="rounded-2xl overflow-hidden" style={{ background: '#FFFFFF', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
        <div className="px-6 py-3.5 flex items-center gap-2" style={{ borderBottom: '1px solid #F2F2F7' }}>
          <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#AEAEB2' }}>Integrations</p>
        </div>
        <div className="px-6 py-5 flex flex-col gap-5">
          {/* Google Calendar */}
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: '#F2F2F7' }}>
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold" style={{ color: '#1C1C1E' }}>Google Calendar</p>
              <p className="text-xs mt-0.5" style={{ color: '#8E8E93' }}>Syncing events via OAuth</p>
            </div>
            <Badge label="Connected" color="#34C759" bg="#EDFBF2" />
          </div>

          <div style={{ height: '1px', background: '#F2F2F7' }} />

          <AppleConnectForm
            connected={appleConnected}
            appleUser={dbUser?.appleCalDAVUser ?? null}
          />
        </div>
      </div>
    </div>
  )
}
