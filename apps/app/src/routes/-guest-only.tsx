import type { ReactNode } from 'react'
import { Navigate } from '@tanstack/react-router'
import { Center, Spinner } from '@chakra-ui/react'
import { useIntl } from 'react-intl'
import { getAuthenticationState } from '../components/layout/utils/getAuthenticationState'
import { authClient } from '../modules/auth/client'

type GuestOnlyProps = { children: ReactNode }

export const GuestOnly = ({ children }: GuestOnlyProps) => {
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

  if (authenticationState === 'authenticated') {
    return <Navigate to="/" />
  }

  return children
}
