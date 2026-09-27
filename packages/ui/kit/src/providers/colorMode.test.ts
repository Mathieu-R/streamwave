import { describe, expect, it } from 'vitest'
import { colorModeStorageKey, getNextColorMode } from './colorMode'

describe('color mode configuration', () => {
  it('uses a Streamwave-specific key for the persisted preference', () => {
    expect(colorModeStorageKey).toBe('streamwave-color-mode')
  })

  it('toggles between light and dark modes', () => {
    expect(getNextColorMode('light')).toBe('dark')
    expect(getNextColorMode('dark')).toBe('light')
  })
})
