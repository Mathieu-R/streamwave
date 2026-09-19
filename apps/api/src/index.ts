import 'dotenv/config'
import { Hono } from 'hono/quick'
import postgres from 'postgres'
import {
  createDb,
  getDatabaseUrl,
  migrateDatabase,
  seedAlbums
} from '@streamwave/drizzle'
import { devServer } from '@streamwave/hono'

const client = postgres(getDatabaseUrl())
const db = createDb(client)

await migrateDatabase(db)

if (process.env.SEED_DATABASE === 'true') {
  await seedAlbums(db)
}

const app = new Hono()

devServer(app)

app.get('/health', (c) => c.json({ ok: true }))

export default app
