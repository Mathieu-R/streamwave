import { defineConfig } from 'drizzle-kit'
import 'dotenv/config'
import { getDatabaseUrl } from './src/databaseUrl'

export default defineConfig({
  schema: './src/schemas/index.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: getDatabaseUrl()
  }
})
