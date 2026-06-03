import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'
import { DrizzleAdapter } from '@auth/drizzle-adapter'
import { db } from '@/lib/db/index.js'
import { accounts, sessions, users, verificationTokens } from '@/lib/db/schema.js'
import { eq } from 'drizzle-orm'

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      authorization: {
        params: {
          scope: [
            'openid',
            'email',
            'profile',
            'https://www.googleapis.com/auth/calendar.readonly',
          ].join(' '),
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google' && account.refresh_token) {
        await db
          .update(users)
          .set({
            googleAccessToken: account.access_token,
            googleRefreshToken: account.refresh_token,
            googleTokenExpiry: account.expires_at
              ? new Date(account.expires_at * 1000)
              : null,
          })
          .where(eq(users.email, user.email))
      }
      return true
    },
    async session({ session, user }) {
      session.user.id = user.id
      return session
    },
  },
  pages: {
    signIn: '/login',
  },
})
