export type AuthenticationState =
  | 'authenticated'
  | 'loading'
  | 'unauthenticated'

export function getAuthenticationState({
  isPending,
  session
}: {
  isPending: boolean
  session: unknown
}): AuthenticationState {
  if (isPending) {
    return 'loading'
  }

  return session ? 'authenticated' : 'unauthenticated'
}
