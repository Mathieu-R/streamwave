import { createFileRoute } from '@tanstack/react-router'
import { SignInPage as AuthSignInPage } from '../modules/auth/client/SignInPage'
import { GuestOnly } from './-guest-only'

const SignInRoute = () => {
  return (
    <GuestOnly>
      <AuthSignInPage />
    </GuestOnly>
  )
}

export const Route = createFileRoute('/sign-in')({
  component: SignInRoute
})
