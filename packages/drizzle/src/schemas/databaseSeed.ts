import { pgTable, timestamp, varchar } from 'drizzle-orm/pg-core'

export const databaseSeed = pgTable('database_seed', {
  name: varchar('name').primaryKey(),
  executedAt: timestamp('executed_at').defaultNow().notNull()
})

export type DatabaseSeed = typeof databaseSeed.$inferSelect
