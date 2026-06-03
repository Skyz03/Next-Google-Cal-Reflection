import Link from 'next/link'
import { signOut } from '@/lib/auth.js'

const NAV = [
  { href: '/', label: 'This week' },
  { href: '/weekly', label: 'Weekly' },
  { href: '/monthly', label: 'Monthly' },
  { href: '/settings', label: 'Settings' },
]

export default function Sidebar({ user }) {
  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 flex flex-col p-5">
      <div className="mb-8">
        <h1 className="font-semibold text-gray-900">Calendar Reflect</h1>
        <p className="text-xs text-gray-400 mt-0.5">{user?.email}</p>
      </div>
      <nav className="flex-1 space-y-1">
        {NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="block px-3 py-2 text-sm text-gray-600 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition"
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <form action={async () => { 'use server'; await signOut({ redirectTo: '/login' }) }}>
        <button type="submit" className="text-xs text-gray-400 hover:text-gray-600">
          Sign out
        </button>
      </form>
    </aside>
  )
}
