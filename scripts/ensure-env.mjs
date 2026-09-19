import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')
const envPath = path.join(rootDir, '.env')
const examplePath = path.join(rootDir, '.env.example')

if (fs.existsSync(envPath)) {
  process.exit(0)
}

if (!fs.existsSync(examplePath)) {
  console.error(
    'Missing .env.example at repository root. Cannot create .env automatically.'
  )
  process.exit(1)
}

const content = fs.readFileSync(examplePath, 'utf8')
fs.writeFileSync(envPath, content, 'utf8')
console.log('fichier .env manquant, création à partir du .env.example')
process.exit(0)
