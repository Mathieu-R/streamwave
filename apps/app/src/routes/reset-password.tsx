import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { ResetPasswordPage } from '../modules/auth/client/ResetPasswordPage'
import { GuestOnly } from './-guest-only'

const resetPasswordSearchSchema = z.object({ token: z.string().optional() })

const ResetPasswordRoute = () => {
  const { token } = Route.useSearch()

  return (
    <GuestOnly>
      <ResetPasswordPage token={token} />
    </GuestOnly>
  )
}

export const Route = createFileRoute('/reset-password')({
  component: ResetPasswordRoute,
  validateSearch: resetPasswordSearchSchema
})
