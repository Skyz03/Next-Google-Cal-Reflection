import { defineConfig } from 'drizzle-kit'

process.loadEnvFile('.env.local')

export default defineConfig({
  schema: './lib/db/schema.js',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL_UNPOOLED,
  },
})
