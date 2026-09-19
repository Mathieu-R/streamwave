import { describe, expect, it } from 'vitest'
import { getAvatarFallback } from './Avatar'

describe('getAvatarFallback', () => {
  it('uses the first letter of the first two words', () => {
    expect(getAvatarFallback('Ada Lovelace')).toBe('AL')
  })

  it('returns a safe fallback for an empty label', () => {
    expect(getAvatarFallback('   ')).toBe('?')
  })
})
