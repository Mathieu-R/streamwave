import { signal } from '@lit-labs/preact-signals'

export const toast = signal({
  show: false,
  messages: [],
  buttons: [],
})
