import { auth } from '../auth'
import type { AuthSession } from '../../shared/schemas'

export async function getAuthSession(
  headers: Headers
): Promise<AuthSession | null> {
  const session = await auth.api.getSession({ headers })

  if (!session) {
    return null
  }

  return {
    user: {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
      emailVerified: session.user.emailVerified,
      firstname: session.user.firstname ?? null,
      lastname: session.user.lastname ?? null
    }
  }
}
