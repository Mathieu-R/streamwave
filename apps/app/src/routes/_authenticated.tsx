import { Navigate, Outlet, createFileRoute } from '@tanstack/react-router'
import { LoaderCircle } from 'lucide-react'
import { useIntl } from 'react-intl'
import { AppShell } from '../components/layout/AppShell'
import { getAuthenticationState } from '../components/layout/utils/getAuthenticationState'
import { authClient } from '../modules/auth/client'

export const Route = createFileRoute('/_authenticated')({
  component: AuthenticatedLayout
})

function AuthenticatedLayout() {
  const { formatMessage } = useIntl()
  const { data: session, isPending } = authClient.useSession()
  const authenticationState = getAuthenticationState({ isPending, session })

  if (authenticationState === 'loading') {
    return (
      <main className="grid min-h-screen place-items-center bg-background text-muted-foreground">
        <LoaderCircle
          aria-label={formatMessage({ id: 'Chargement de la session' })}
          className="size-6 animate-spin"
        />
      </main>
    )
  }

  if (authenticationState === 'unauthenticated' || !session) {
    return <Navigate to="/sign-in" />
  }

  const user = session.user
  const firstname =
    'firstname' in user && typeof user.firstname === 'string'
      ? user.firstname
      : null
  const lastname =
    'lastname' in user && typeof user.lastname === 'string'
      ? user.lastname
      : null

  return (
    <AppShell
      user={{
        email: user.email,
        firstname,
        image: user.image,
        lastname,
        name: user.name
      }}
    >
      <Outlet />
    </AppShell>
  )
}
