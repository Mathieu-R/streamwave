import 'dotenv/config'
import { runMigrations } from './migration'

runMigrations().catch((err: unknown) => {
  console.error(err)
  process.exitCode = 1
})
