import { auth } from './auth.js'
import { db } from './db/index.js'
import { users } from './db/schema.js'
import { eq } from 'drizzle-orm'

/**
 * Returns the authenticated user's DB id, or null if unauthenticated.
 * Works around NextAuth v5 beta quirk where session.user.id may be absent
 * by falling back to an email-based lookup.
 */
export async function getSessionUserId() {
  const session = await auth()
  if (!session?.user?.email) return null

  if (session.user.id) return session.user.id

  const [row] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, session.user.email))
  return row?.id ?? null
}
