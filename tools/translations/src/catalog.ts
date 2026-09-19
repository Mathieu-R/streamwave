import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

export type MessageCatalog = Record<string, string>

const dirname = path.dirname(fileURLToPath(import.meta.url))
const packageRoot = path.resolve(dirname, '..')
const formatjsExecutable = path.join(packageRoot, 'node_modules/.bin/formatjs')

export const frenchCatalogPath = path.join(dirname, 'locales/fr.json')
export const englishCatalogPath = path.join(dirname, 'locales/en.json')

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function readJson(filePath: string): unknown {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'))
}

export function readCatalog(filePath: string): MessageCatalog {
  const value = readJson(filePath)

  if (
    !isRecord(value) ||
    Object.values(value).some((message) => typeof message !== 'string')
  ) {
    throw new Error(`Invalid message catalog: ${filePath}`)
  }

  return value as MessageCatalog
}

export function writeCatalog(filePath: string, catalog: MessageCatalog): void {
  fs.mkdirSync(path.dirname(filePath), { recursive: true })
  fs.writeFileSync(filePath, `${JSON.stringify(catalog, null, 2)}\n`, 'utf8')
}

export function extractFrenchCatalog(): MessageCatalog {
  const temporaryDirectory = fs.mkdtempSync(
    path.join(os.tmpdir(), 'streamwave-translations-')
  )
  const extractedCatalogPath = path.join(temporaryDirectory, 'messages.json')
  const sourceGlob = path.join(packageRoot, '../../apps/app/src/**/*.{ts,tsx}')

  try {
    execFileSync(
      formatjsExecutable,
      ['extract', sourceGlob, '--out-file', extractedCatalogPath],
      { cwd: packageRoot, stdio: 'inherit' }
    )

    const extractedMessages = readJson(extractedCatalogPath)
    if (!isRecord(extractedMessages)) {
      throw new Error('FormatJS extraction did not return a message catalog')
    }

    return Object.fromEntries(
      Object.entries(extractedMessages)
        .sort(([leftId], [rightId]) => leftId.localeCompare(rightId))
        .map(([id, descriptor]) => {
          if (
            isRecord(descriptor) &&
            descriptor.defaultMessage !== undefined &&
            descriptor.defaultMessage !== id
          ) {
            throw new Error(
              `The default message must match its French ID: ${id}`
            )
          }

          return [id, id]
        })
    )
  } finally {
    fs.rmSync(temporaryDirectory, { recursive: true, force: true })
  }
}
