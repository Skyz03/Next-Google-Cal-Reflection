import { auth } from '@/lib/auth.js'
import { redirect } from 'next/navigation'
import Sidebar from '@/components/sidebar.jsx'

export const metadata = {
  robots: { index: false, follow: false },
}

export default async function DashboardLayout({ children }) {
  const session = await auth()
  if (!session) redirect('/login')

  return (
    <div className="flex min-h-screen" style={{ background: '#F2F2F7' }}>
      <Sidebar user={session.user} />
      <main className="flex-1 ml-64 p-8 min-h-screen">
        {children}
      </main>
    </div>
  )
}
