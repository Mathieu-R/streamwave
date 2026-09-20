import { describe, expect, it } from 'vitest'
import { getAuthenticationState } from './getAuthenticationState'

describe('getAuthenticationState', () => {
  it('keeps the layout in a loading state while the session is resolving', () => {
    expect(getAuthenticationState({ isPending: true, session: null })).toBe(
      'loading'
    )
  })

  it('marks a missing resolved session as unauthenticated', () => {
    expect(getAuthenticationState({ isPending: false, session: null })).toBe(
      'unauthenticated'
    )
  })

  it('marks a resolved session as authenticated', () => {
    expect(
      getAuthenticationState({ isPending: false, session: { user: {} } })
    ).toBe('authenticated')
  })
})
