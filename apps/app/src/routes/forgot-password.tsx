import { createFileRoute } from '@tanstack/react-router'
import { ForgotPasswordPage } from '../modules/auth/client/ForgotPasswordPage'
import { GuestOnly } from './-guest-only'

const ForgotPasswordRoute = () => {
  return (
    <GuestOnly>
      <ForgotPasswordPage />
    </GuestOnly>
  )
}

export const Route = createFileRoute('/forgot-password')({
  component: ForgotPasswordRoute
})
