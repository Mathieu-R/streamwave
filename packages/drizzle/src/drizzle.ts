import { PGlite } from '@electric-sql/pglite'
import { drizzle as drizzlePglite } from 'drizzle-orm/pglite'
import { drizzle as drizzlePostgres } from 'drizzle-orm/postgres-js'
import type postgres from 'postgres'
import * as schema from './schema'

export type PgliteDatabase = ReturnType<typeof drizzlePglite<typeof schema>>
export type PostgresDatabase = ReturnType<typeof drizzlePostgres<typeof schema>>

export type DrizzleClient = PgliteDatabase | PostgresDatabase

export function createDb(client: PGlite): PgliteDatabase
export function createDb(client: postgres.Sql): PostgresDatabase
export function createDb(
  client: PGlite | postgres.Sql
): PgliteDatabase | PostgresDatabase {
  if (client instanceof PGlite) {
    return drizzlePglite({ client, schema })
  }

  return drizzlePostgres(client, { schema })
}

export type Database = ReturnType<typeof createDb>
