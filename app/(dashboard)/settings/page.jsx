import { auth } from '@/lib/auth.js'
import { redirect } from 'next/navigation'

export default async function SettingsPage() {
  const session = await auth()
  if (!session?.user) redirect('/login')

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-semibold text-gray-900 mb-8">Settings</h1>
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <p className="text-sm font-medium text-gray-700">Signed in as</p>
        <p className="text-sm text-gray-500 mt-1">{session.user.email}</p>
      </div>
    </div>
  )
}
