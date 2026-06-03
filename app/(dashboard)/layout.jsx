import { auth } from '@/lib/auth.js'
import { redirect } from 'next/navigation'
import Sidebar from '@/components/sidebar.jsx'

export default async function DashboardLayout({ children }) {
  const session = await auth()
  if (!session) redirect('/login')

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar user={session.user} />
      <main className="flex-1 p-8 ml-64">{children}</main>
    </div>
  )
}
