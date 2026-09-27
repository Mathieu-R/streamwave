import { createFileRoute } from '@tanstack/react-router'
import { SignUpPage } from '../modules/auth/client/SignUpPage'
import { GuestOnly } from './-guest-only'

const SignUpRoute = () => {
  return (
    <GuestOnly>
      <SignUpPage />
    </GuestOnly>
  )
}

export const Route = createFileRoute('/sign-up')({
  component: SignUpRoute
})
