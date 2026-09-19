import 'dotenv/config'
import postgres from 'postgres'
import { getDatabaseUrl } from '@streamwave/drizzle/databaseUrl'
import { createDb } from '@streamwave/drizzle/drizzle'

const client = postgres(getDatabaseUrl())

export const db = createDb(client)
