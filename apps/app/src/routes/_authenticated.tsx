import { Navigate, Outlet, createFileRoute } from '@tanstack/react-router'
import { Center, Spinner } from '@chakra-ui/react'
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
      <Center as="main" minH="dvh">
        <Spinner
          aria-label={formatMessage({ id: 'Chargement de la session' })}
        />
      </Center>
    )
  }

  if (authenticationState === 'unauthenticated' || !session) {
    return <Navigate to="/sign-in" />
  }

  const user = session.user
  const firstname =
    'firstname' in user && typeof user.firstname === 'string'
      ? user.firstname
      : undefined
  const lastname =
    'lastname' in user && typeof user.lastname === 'string'
      ? user.lastname
      : undefined

  return (
    <AppShell
      user={{
        email: user.email,
        firstname,
        image: user.image ?? undefined,
        lastname,
        name: user.name ?? undefined
      }}
    >
      <Outlet />
    </AppShell>
  )
}
