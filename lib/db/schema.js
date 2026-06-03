import { pgTable, uuid, text, timestamp, integer, boolean, jsonb, date, unique } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name'),
  email: text('email').notNull().unique(),
  emailVerified: timestamp('email_verified'),
  image: text('image'),
  googleAccessToken: text('google_access_token'),
  googleRefreshToken: text('google_refresh_token'),
  googleTokenExpiry: timestamp('google_token_expiry'),
  googleSyncToken: text('google_sync_token'),
  createdAt: timestamp('created_at').defaultNow(),
})

export const accounts = pgTable('accounts', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  type: text('type').notNull(),
  provider: text('provider').notNull(),
  providerAccountId: text('provider_account_id').notNull(),
  refreshToken: text('refresh_token'),
  accessToken: text('access_token'),
  expiresAt: integer('expires_at'),
  tokenType: text('token_type'),
  scope: text('scope'),
  idToken: text('id_token'),
})

export const sessions = pgTable('sessions', {
  id: uuid('id').primaryKey().defaultRandom(),
  sessionToken: text('session_token').notNull().unique(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  expires: timestamp('expires').notNull(),
})

export const verificationTokens = pgTable('verification_tokens', {
  identifier: text('identifier').notNull(),
  token: text('token').notNull().unique(),
  expires: timestamp('expires').notNull(),
})

export const events = pgTable('events', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  source: text('source').notNull().default('google'),
  externalId: text('external_id').notNull(),
  title: text('title').notNull(),
  startAt: timestamp('start_at', { withTimezone: true }).notNull(),
  endAt: timestamp('end_at', { withTimezone: true }).notNull(),
  category: text('category'),
  calendarName: text('calendar_name'),
  attendeeCount: integer('attendee_count').default(0),
  isRecurring: boolean('is_recurring').default(false),
  isAllDay: boolean('is_all_day').default(false),
  rawMetadata: jsonb('raw_metadata'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (t) => ({
  uniq: unique().on(t.userId, t.externalId),
}))

export const reflections = pgTable('reflections', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  period: text('period').notNull(),
  periodStart: date('period_start').notNull(),
  periodEnd: date('period_end').notNull(),
  summary: text('summary'),
  categoryBreakdown: jsonb('category_breakdown'),
  insights: jsonb('insights'),
  totalHours: integer('total_hours'),
  meetingHours: integer('meeting_hours'),
  focusHours: integer('focus_hours'),
  generatedAt: timestamp('generated_at').defaultNow(),
}, (t) => ({
  uniq: unique().on(t.userId, t.period, t.periodStart),
}))
