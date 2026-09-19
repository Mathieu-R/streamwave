import { translate } from '@vitalets/google-translate-api'
import {
  englishCatalogPath,
  extractFrenchCatalog,
  frenchCatalogPath,
  readCatalog,
  writeCatalog,
  type MessageCatalog
} from './catalog'

async function translateNewMessages(frenchCatalog: MessageCatalog): Promise<MessageCatalog> {
  const previousEnglishCatalog = readCatalog(englishCatalogPath)
  const englishCatalog: MessageCatalog = {}

  for (const id of Object.keys(frenchCatalog)) {
    const existingTranslation = previousEnglishCatalog[id]
    if (existingTranslation) {
      englishCatalog[id] = existingTranslation
      continue
    }

    console.log(`Translating: ${id}`)
    const { text } = await translate(id, { to: 'en' })
    englishCatalog[id] = text
  }

  return englishCatalog
}

async function run(): Promise<void> {
  const frenchCatalog = extractFrenchCatalog()
  const englishCatalog = await translateNewMessages(frenchCatalog)

  writeCatalog(frenchCatalogPath, frenchCatalog)
  writeCatalog(englishCatalogPath, englishCatalog)
  console.log('Translation catalogs updated.')
}

void run()
