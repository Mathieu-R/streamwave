import 'dotenv/config'
import postgres from 'postgres'
import { getDatabaseUrl } from './databaseUrl'
import { createDb } from './drizzle'
import { migrateDatabase } from './migration'
import { seedAlbums } from './seedAlbums'

async function runSeed() {
  const client = postgres(getDatabaseUrl(), { max: 1 })

  try {
    const db = createDb(client)
    await migrateDatabase(db)
    await seedAlbums(db)
  } finally {
    await client.end()
  }
}

runSeed().catch((err: unknown) => {
  console.error(err)
  process.exitCode = 1
})
