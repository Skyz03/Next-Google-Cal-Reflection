'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOutAction } from '@/app/actions.js'

const NAV = [
  {
    href: '/',
    label: 'Overview',
    sub: 'Stats & breakdown',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/>
        <rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>
      </svg>
    ),
  },
  {
    href: '/weekly',
    label: 'Weekly',
    sub: 'Reflection history',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2"/>
        <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
        <line x1="3" y1="10" x2="21" y2="10"/>
        <circle cx="8" cy="15" r="1" fill="currentColor" stroke="none"/>
        <circle cx="12" cy="15" r="1" fill="currentColor" stroke="none"/>
      </svg>
    ),
  },
  {
    href: '/monthly',
    label: 'Monthly',
    sub: 'Reflection history',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2"/>
        <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
        <line x1="3" y1="10" x2="21" y2="10"/>
        <circle cx="7" cy="15" r="1" fill="currentColor" stroke="none"/>
        <circle cx="12" cy="15" r="1" fill="currentColor" stroke="none"/>
        <circle cx="17" cy="15" r="1" fill="currentColor" stroke="none"/>
        <circle cx="7" cy="19" r="1" fill="currentColor" stroke="none"/>
        <circle cx="12" cy="19" r="1" fill="currentColor" stroke="none"/>
      </svg>
    ),
  },
  {
    href: '/settings',
    label: 'Settings',
    sub: 'Account & integrations',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3"/>
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
      </svg>
    ),
  },
]

function Avatar({ email, name }) {
  const initials = (name ?? email ?? 'U').slice(0, 2).toUpperCase()
  return (
    <div
      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 select-none"
      style={{ background: 'linear-gradient(135deg, #5856D6, #7876E0)' }}
    >
      {initials}
    </div>
  )
}

export default function Sidebar({ user }) {
  const pathname = usePathname()

  return (
    <aside
      className="fixed left-0 top-0 h-screen w-64 flex flex-col z-40"
      style={{ background: '#FFFFFF', borderRight: '1px solid #E5E5EA' }}
    >
      {/* Logo */}
      <div className="px-5 pt-6 pb-5">
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: '#5856D6' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
          </div>
          <span className="font-semibold text-sm tracking-tight" style={{ color: '#1C1C1E' }}>
            Calendar Reflect
          </span>
        </div>
      </div>

      <div style={{ height: '1px', background: '#F2F2F7', margin: '0 20px' }} />

      {/* Navigation */}
      <nav className="flex-1 px-3 pt-4 pb-2 space-y-0.5">
        {NAV.map((item) => {
          const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
              style={{
                background: isActive ? '#EEF0FB' : 'transparent',
                color: isActive ? '#5856D6' : '#6E6E73',
                '--tw-ring-color': '#5856D6',
              }}
            >
              <span className="shrink-0">{item.icon}</span>
              <span className="flex-1 min-w-0">
                <span className="block">{item.label}</span>
                <span className="block text-xs font-normal mt-0.5" style={{ color: isActive ? '#7876E0' : '#AEAEB2' }}>{item.sub}</span>
              </span>
            </Link>
          )
        })}
      </nav>

      {/* User footer */}
      <div className="px-4 pb-5 pt-3" style={{ borderTop: '1px solid #F2F2F7' }}>
        <div className="flex items-center gap-3 mb-3">
          <Avatar email={user?.email} name={user?.name} />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold truncate leading-tight" style={{ color: '#1C1C1E' }}>
              {user?.name ?? user?.email?.split('@')[0]}
            </p>
            <p className="text-xs truncate leading-tight mt-0.5" style={{ color: '#AEAEB2' }}>
              {user?.email}
            </p>
          </div>
        </div>
        <form action={signOutAction}>
          <button
            type="submit"
            className="w-full text-left text-xs px-3 py-1.5 rounded-lg transition-colors duration-150 cursor-pointer hover:bg-gray-100"
            style={{ color: '#AEAEB2' }}
          >
            Sign out
          </button>
        </form>
      </div>
    </aside>
  )
}
