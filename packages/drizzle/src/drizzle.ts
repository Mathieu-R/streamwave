import { PGlite } from '@electric-sql/pglite'
import { drizzle as drizzlePglite } from 'drizzle-orm/pglite'
import { drizzle as drizzlePostgres } from 'drizzle-orm/postgres-js'
import type postgres from 'postgres'
import * as schema from './schema'

export function createDb(client: PGlite): ReturnType<typeof drizzlePglite>
export function createDb(
  client: postgres.Sql
): ReturnType<typeof drizzlePostgres>
export function createDb(
  client: PGlite | postgres.Sql
): ReturnType<typeof drizzlePglite> | ReturnType<typeof drizzlePostgres> {
  if (client instanceof PGlite) {
    return drizzlePglite({ client, schema })
  }

  return drizzlePostgres(client, { schema })
}

export type Database = ReturnType<typeof createDb>
