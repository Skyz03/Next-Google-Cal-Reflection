# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Important: Next.js Version

This project runs **Next.js 16** (not 15 or 14). Before writing any Next.js-specific code, read the relevant guide in `node_modules/next/dist/docs/`. Key breaking changes from prior versions:
- `params` and `searchParams` in pages/layouts are now **async** — always `await` them
- `middleware` has been renamed to `proxy`
- Turbopack is on by default

## Commands

```bash
# Development
npm run dev                         # Next.js dev server (localhost:3000)
npx inngest-cli@latest dev -u http://localhost:3000/api/inngest  # Inngest local runner (localhost:8288)

# Database
npx drizzle-kit generate            # Generate migration from schema changes
npx drizzle-kit migrate             # Apply migrations to Neon DB

# Lint
npm run lint
```

> `drizzle-kit` reads `.env.local` via `process.loadEnvFile('.env.local')` in `drizzle.config.js` — no need to export env vars manually.

## Architecture

**Stack**: Next.js 16 App Router · JavaScript only (no TypeScript, no `.ts`/`.tsx`) · Neon (Postgres) · Drizzle ORM · NextAuth v5 beta · Inngest · Recharts · Tailwind v4

### Data flow

```
Google Calendar API          Apple iCloud CalDAV
      ↓                              ↓
lib/google/sync.js        lib/apple/sync.js
      ↓                              ↓
      └──────────┬───────────────────┘
                 ↓
         events table (source: 'google' | 'apple')
                 ↓
      lib/logic/categorise.js   — pure keyword-rule categorisation (no AI)
                 ↓
      lib/logic/reflect.js      — computes stats, writes to `reflections` table
                 ↓
      app/(dashboard)/page.jsx  — server component reads DB directly
```

### Triggering a sync

`POST /api/sync` (called by `SyncButton`) runs synchronously:
1. `syncGoogleCalendar(userId)` + `syncAppleCalendar(userId)` in parallel — Apple is a no-op if not connected
2. `generateWeeklyReflection(userId)` + `generateMonthlyReflection(userId)` in parallel

Inngest background jobs (`lib/jobs/definitions.js`) exist for cron-triggered syncs but are **not** used by the manual sync button.

### Apple Calendar (CalDAV)

Apple Calendar uses the CalDAV protocol — there is no OAuth. Users connect via iCloud email + an app-specific password (generated at appleid.apple.com).

- `lib/apple/sync.js` — fetches events from `caldav.icloud.com` using `tsdav`, parses iCal with `node-ical`
- Credentials are stored in `users.appleCalDAVUser` and `users.appleCalDAVPassword` (plain text, same pattern as Google tokens)
- `validateAppleCredentials(username, password)` — called at connect-time to test before saving
- Apple event `externalId` is prefixed `apple:<uid>` to prevent collisions with Google IDs
- `tsdav` and `node-ical` are listed in `next.config.mjs` `serverExternalPackages` — they use Node.js internals that Turbopack cannot bundle

Server actions for Apple credentials are in `app/actions.js`: `saveAppleCredentials` and `disconnectApple`.
Settings UI: `app/(dashboard)/settings/apple-connect-form.jsx` (client component).

### Auth quirk

NextAuth v5 beta sometimes omits `session.user.id`. Always use `getSessionUserId()` from `lib/session.js` instead of `session.user.id` directly. It falls back to an email-based DB lookup.

Google OAuth tokens are stored in **two places**:
- `accounts` table — written by DrizzleAdapter automatically
- `users` table (`googleRefreshToken`, `googleAccessToken`) — written by the `signIn` callback

`lib/google/client.js` reads from `users` first and falls back to `accounts`, backfilling `users` on the first successful fallback.

### Route groups

- `app/(auth)/` — unauthenticated routes (login page); interactive elements must be extracted to client components (`login-button.jsx`) since the page is a Server Component with an inline server action
- `app/(dashboard)/` — auth-gated routes; `layout.jsx` redirects to `/login` if no session

### Database schema key points

- `events.externalId` + `events.userId` is a unique constraint — upserts use `onConflictDoUpdate`
- `events.source` is `'google'` or `'apple'`; Apple IDs are prefixed `apple:` so the existing unique constraint covers both sources without schema changes
- `reflections` has a unique constraint on `(userId, period, periodStart)` — safe to call `generateWeeklyReflection` multiple times
- `users.googleSyncToken` stores the Google Calendar incremental sync token; set to `null` to force full re-sync; HTTP 410 from Google auto-triggers this
- `users.appleCalDAVUser` / `users.appleCalDAVPassword` — null when Apple Calendar is not connected

### Environment variables

All required keys are in `.env.local`. For production (Vercel), also set `AUTH_URL` — NextAuth v5 reads `AUTH_URL`, not `NEXTAUTH_URL`, in production.
