import { signal } from '@lit-labs/preact-signals'
import { Settings } from '#types/signals'

export const settings = signal<Settings>({
  fade: 0,
  downloadQuality: 256,
  limitData: false,
  maxData: 0,
})
