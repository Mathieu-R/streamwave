import englishMessages from './locales/en.json'
import frenchMessages from './locales/fr.json'

export const messages = {
  en: englishMessages,
  fr: frenchMessages
} as const

export type Locale = keyof typeof messages
