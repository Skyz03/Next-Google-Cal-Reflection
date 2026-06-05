'use server'
import { signOut } from '@/lib/auth.js'
import { getSessionUserId } from '@/lib/session.js'
import { db } from '@/lib/db/index.js'
import { users } from '@/lib/db/schema.js'
import { eq } from 'drizzle-orm'
import { validateAppleCredentials } from '@/lib/apple/sync.js'

export async function signOutAction() {
  await signOut({ redirectTo: '/login' })
}

export async function saveAppleCredentials(prevState, formData) {
  const userId = await getSessionUserId()
  if (!userId) return { error: 'Not authenticated' }

  const username = formData.get('appleUser')?.toString().trim()
  const password = formData.get('applePassword')?.toString().trim()

  if (!username || !password) return { error: 'Email and password are required' }

  const { valid, error } = await validateAppleCredentials(username, password)
  if (!valid) return { error: `Could not connect to iCloud: ${error}` }

  await db.update(users)
    .set({ appleCalDAVUser: username, appleCalDAVPassword: password })
    .where(eq(users.id, userId))

  return { success: true }
}

export async function disconnectApple() {
  const userId = await getSessionUserId()
  if (!userId) return { error: 'Not authenticated' }

  await db.update(users)
    .set({ appleCalDAVUser: null, appleCalDAVPassword: null })
    .where(eq(users.id, userId))

  return { success: true }
}
