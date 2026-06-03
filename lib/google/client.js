import { google } from 'googleapis'
import { db } from '@/lib/db/index.js'
import { users, accounts } from '@/lib/db/schema.js'
import { eq, and } from 'drizzle-orm'

export async function getGoogleClient(userId) {
  if (!userId) throw new Error('getGoogleClient called with no userId')

  const [user] = await db.select().from(users).where(eq(users.id, userId))
  if (!user) throw new Error('User not found: ' + userId)

  let refreshToken = user.googleRefreshToken
  let accessToken = user.googleAccessToken
  let expiryDate = user.googleTokenExpiry?.getTime()

  // Fall back to the accounts table — DrizzleAdapter always stores tokens there
  if (!refreshToken) {
    const [acct] = await db
      .select()
      .from(accounts)
      .where(and(eq(accounts.userId, userId), eq(accounts.provider, 'google')))

    if (!acct?.refreshToken) {
      throw new Error('No Google refresh token for user ' + userId + '. Sign out and sign back in.')
    }

    refreshToken = acct.refreshToken
    accessToken = acct.accessToken ?? null
    expiryDate = acct.expiresAt ? acct.expiresAt * 1000 : undefined

    // Backfill users table so future calls skip this fallback
    await db.update(users).set({
      googleAccessToken: accessToken,
      googleRefreshToken: refreshToken,
      googleTokenExpiry: expiryDate ? new Date(expiryDate) : null,
    }).where(eq(users.id, userId))
  }

  const oauth2Client = new google.auth.OAuth2(
    process.env.AUTH_GOOGLE_ID,
    process.env.AUTH_GOOGLE_SECRET
  )

  oauth2Client.setCredentials({
    access_token: accessToken,
    refresh_token: refreshToken,
    expiry_date: expiryDate,
  })

  oauth2Client.on('tokens', async (tokens) => {
    await db.update(users).set({
      googleAccessToken: tokens.access_token,
      ...(tokens.refresh_token && { googleRefreshToken: tokens.refresh_token }),
      googleTokenExpiry: tokens.expiry_date ? new Date(tokens.expiry_date) : null,
    }).where(eq(users.id, userId))
  })

  return oauth2Client
}
