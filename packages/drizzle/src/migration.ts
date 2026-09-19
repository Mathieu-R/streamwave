import { migrate } from 'drizzle-orm/postgres-js/migrator'
import postgres from 'postgres'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { getDatabaseUrl } from './databaseUrl'
import { createDb, type PostgresDatabase } from './drizzle'
import 'dotenv/config'

const sourceDirectory = dirname(fileURLToPath(import.meta.url))
export const migrationsFolder = resolve(sourceDirectory, '../drizzle')

export async function migrateDatabase(db: PostgresDatabase): Promise<void> {
  await migrate(db, { migrationsFolder })
}

export async function runMigrations(): Promise<void> {
  const migrationClient = postgres(getDatabaseUrl(), { max: 1 })
  const db = createDb(migrationClient)

  try {
    await migrateDatabase(db)
  } finally {
    await migrationClient.end()
  }
}
