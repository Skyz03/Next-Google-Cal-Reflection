# Calendar Reflect

A personal productivity app that reads your Google Calendar and/or Apple Calendar, categorises your events, and generates weekly and monthly reflections from the patterns it finds — no AI required.

## What it does

- **Syncs** Google Calendar (90-day backfill on first run, incremental afterwards) and/or Apple Calendar via iCloud CalDAV
- **Categorises** every event automatically using keyword rules: Meeting, Work, Health, Learning, Social, Family, Admin, or Other
- **Generates reflections** with stats, pattern observations, and suggestions — computed entirely from your data
- **Scores your week** on a 0–100 balance scale based on meeting load, focus time, health, and learning

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 App Router (JavaScript) |
| Database | Neon (Postgres) via Drizzle ORM |
| Auth | NextAuth v5 + Google OAuth |
| Calendar sync | Google Calendar API · iCloud CalDAV (`tsdav` + `node-ical`) |
| Background jobs | Inngest |
| Charts | Recharts |
| Styling | Tailwind CSS v4 |
| Deployment | Vercel |

## Local setup

### 1. Clone and install

```bash
git clone <repo-url>
cd calendar-reflect
npm install
```

### 2. Create a Google OAuth app

1. Go to [Google Cloud Console](https://console.cloud.google.com/) → APIs & Services → Credentials
2. Create an **OAuth 2.0 Client ID** (Web application)
3. Add `http://localhost:3000/api/auth/callback/google` to **Authorized redirect URIs**
4. Enable the **Google Calendar API** for your project
5. Add yourself as a test user under **OAuth consent screen → Test users**

### 3. Create a Neon database

Sign up at [neon.tech](https://neon.tech), create a project, and copy both the **pooled** and **direct** connection strings.

### 4. Configure environment variables

Fill in `.env.local`:

```
AUTH_SECRET=           # openssl rand -base64 32
AUTH_GOOGLE_ID=        # from Google Cloud Console
AUTH_GOOGLE_SECRET=    # from Google Cloud Console
DATABASE_URL=          # Neon pooled connection string
DATABASE_URL_UNPOOLED= # Neon direct connection string
INNGEST_EVENT_KEY=     # from app.inngest.com
INNGEST_SIGNING_KEY=   # from app.inngest.com
NEXTAUTH_URL=http://localhost:3000
CRON_SECRET=           # openssl rand -base64 32
```

### 5. Run migrations

```bash
npx drizzle-kit generate
npx drizzle-kit migrate
```

### 6. Start the dev server

```bash
# Terminal 1 — app
npm run dev

# Terminal 2 — Inngest local runner (optional, needed for background jobs)
npx inngest-cli@latest dev -u http://localhost:3000/api/inngest
```

Visit `http://localhost:3000`, sign in with Google, and click **Sync calendar**.

### Connecting Apple Calendar (optional)

Apple Calendar uses CalDAV — no OAuth. You'll need an **app-specific password**:

1. Go to [appleid.apple.com](https://appleid.apple.com) → Sign-In & Security → App-Specific Passwords
2. Generate a password for "Calendar Reflect"
3. In the app, go to **Settings → Integrations → Apple Calendar** and enter your iCloud email + that password

Once connected, both Google and Apple events sync together whenever you hit **Sync calendar**.

## Deployment (Vercel)

1. Push to GitHub and import the repo at [vercel.com](https://vercel.com)
2. Add all `.env.local` variables as Vercel environment variables, plus:
   ```
   AUTH_URL=https://your-project.vercel.app
   ```
3. Add `https://your-project.vercel.app/api/auth/callback/google` to your Google OAuth client's **Authorized redirect URIs**
4. After deploy, go to [app.inngest.com](https://app.inngest.com) → Apps → **Sync App** and enter:
   ```
   https://your-project.vercel.app/api/inngest
   ```

> Vercel Hobby plan only supports daily cron jobs. The sync cron runs at 6 AM UTC daily; the reflection cron runs every Sunday at 8 PM UTC.

## How categorisation works

Events are matched against ordered keyword rules — first match wins. The full rule set lives in `lib/logic/categorise.js`. If no rule matches, events with 2+ attendees fall back to **Meeting**, otherwise **Other**.

## How the balance score works

Starts at 70 and adjusts based on the week's data:

| Condition | Change |
|---|---|
| Meeting load > 50% of total time | −20 |
| Meeting load 40–50% | −10 |
| Any health events logged | +10 |
| Any learning events logged | +5 |
| 10+ hours of focus/deep work | +10 |

Score is clamped between 0 and 100.
