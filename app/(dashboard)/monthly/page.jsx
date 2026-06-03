import { getSessionUserId } from '@/lib/session.js'
import { redirect } from 'next/navigation'
import { getReflectionHistory } from '@/lib/db/queries.js'
import ReflectionCard from '@/components/reflection-card.jsx'

export default async function MonthlyPage() {
  const userId = await getSessionUserId()
  if (!userId) redirect('/login')

  const history = await getReflectionHistory(userId, 'monthly', 12)

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-semibold text-gray-900 mb-8">Monthly reflections</h1>
      {history.length === 0 && (
        <p className="text-gray-400 text-sm">No monthly reflections yet. They generate at end of month.</p>
      )}
      <div className="space-y-6">
        {history.map((r) => <ReflectionCard key={r.id} reflection={r} />)}
      </div>
    </div>
  )
}
