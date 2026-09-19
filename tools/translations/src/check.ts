import { extractFrenchCatalog, frenchCatalogPath, readCatalog } from './catalog'

const extractedCatalog = extractFrenchCatalog()
const committedCatalog = readCatalog(frenchCatalogPath)

if (JSON.stringify(extractedCatalog) !== JSON.stringify(committedCatalog)) {
  throw new Error(
    'French translations are out of date. Run `pnpm run translate` and commit src/locales/fr.json.'
  )
}

console.log('French translations are up to date.')
