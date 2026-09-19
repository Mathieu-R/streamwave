import { drizzle } from 'drizzle-orm/postgres-js'
import { migrate } from 'drizzle-orm/postgres-js/migrator'
import postgres from 'postgres'
import { getDatabaseUrl } from './databaseUrl'
import 'dotenv/config'

async function runMigrations() {
  const migrationClient = postgres(getDatabaseUrl(), { max: 1 })
  const db = drizzle(migrationClient)

  await migrate(db, { migrationsFolder: './drizzle' })

  await migrationClient.end()
  process.exit(0)
}

runMigrations().catch((err: unknown) => {
  console.error(err)
  process.exit(1)
})
