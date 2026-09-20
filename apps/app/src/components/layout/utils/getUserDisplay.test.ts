import { describe, expect, it } from 'vitest'
import { getUserDisplay } from './getUserDisplay'

describe('getUserDisplay', () => {
  it('prefers the legacy first and last name fields', () => {
    expect(
      getUserDisplay({
        email: 'ada@example.com',
        firstname: 'Ada',
        lastname: 'Lovelace',
        name: 'Ada L.'
      })
    ).toMatchObject({ name: 'Ada Lovelace', fallback: 'Ada Lovelace' })
  })

  it('falls back to the email address when no name is available', () => {
    expect(getUserDisplay({ email: 'listener@example.com' }).name).toBe(
      'listener@example.com'
    )
  })
})
