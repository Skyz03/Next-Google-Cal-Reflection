import { auth } from '@/lib/auth.js'
import { redirect } from 'next/navigation'
import Sidebar from '@/components/sidebar.jsx'

export default async function DashboardLayout({ children }) {
  const session = await auth()
  if (!session) redirect('/login')

  return (
    <div className="flex min-h-screen" style={{ background: '#06091A' }}>
      {/* Ambient background blobs — give glassmorphism cards something to blur against */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
        <div
          className="absolute rounded-full"
          style={{
            top: '8%', left: '30%',
            width: '480px', height: '480px',
            background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            bottom: '15%', right: '20%',
            width: '360px', height: '360px',
            background: 'radial-gradient(circle, rgba(139,92,246,0.09) 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            top: '55%', left: '10%',
            width: '280px', height: '280px',
            background: 'radial-gradient(circle, rgba(52,211,153,0.06) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
      </div>

      <Sidebar user={session.user} />
      <main className="flex-1 ml-64 p-8 min-h-screen relative" style={{ zIndex: 1 }}>
        {children}
      </main>
    </div>
  )
}
