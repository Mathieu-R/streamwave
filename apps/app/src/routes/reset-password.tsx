import { zodResolver } from '@hookform/resolvers/zod'
import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { FormattedMessage, useIntl } from 'react-intl'
import { z } from 'zod'
import { Button } from '@/components/button/Button'
import { AuthLayout } from '../modules/auth/client/components/AuthLayout'
import { FormField } from '../modules/auth/client/components/FormField'
import { authClient } from '../modules/auth/client'
import {
  resetPasswordSchema,
  type ResetPasswordValues
} from '../modules/auth/shared/formSchemas'

const resetPasswordSearchSchema = z.object({ token: z.string().optional() })

export const Route = createFileRoute('/reset-password')({
  component: ResetPasswordPage,
  validateSearch: resetPasswordSearchSchema
})

function ResetPasswordPage() {
  const { formatMessage } = useIntl()
  const navigate = useNavigate()
  const { token } = Route.useSearch()
  const [error, setError] = useState<string>()
  const form = useForm<ResetPasswordValues>({
    defaultValues: { password: '', passwordConfirmation: '' },
    resolver: zodResolver(resetPasswordSchema)
  })

  const onSubmit = form.handleSubmit(async ({ password }) => {
    if (!token) {
      setError(
        formatMessage({
          id: 'Ce lien de réinitialisation est invalide ou a expiré.'
        })
      )
      return
    }

    setError(undefined)
    const result = await authClient.resetPassword({
      newPassword: password,
      token
    })

    if (result.error) {
      setError(
        result.error.message ??
          formatMessage({ id: 'La réinitialisation du mot de passe a échoué.' })
      )
      return
    }

    await navigate({ to: '/sign-in' })
  })

  return (
    <AuthLayout
      description={
        <FormattedMessage id="Choisissez un nouveau mot de passe sécurisé." />
      }
      title={<FormattedMessage id="Réinitialiser le mot de passe" />}
    >
      <FormProvider {...form}>
        <form className="grid gap-5" noValidate onSubmit={onSubmit}>
          <FormField<ResetPasswordValues>
            autoComplete="new-password"
            label={formatMessage({ id: 'Nouveau mot de passe' })}
            name="password"
            type="password"
          />
          <FormField<ResetPasswordValues>
            autoComplete="new-password"
            label={formatMessage({ id: 'Confirmer le mot de passe' })}
            name="passwordConfirmation"
            type="password"
          />
          {error && (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          )}
          <Button
            disabled={form.formState.isSubmitting || !token}
            type="submit"
          >
            <FormattedMessage id="Réinitialiser le mot de passe" />
          </Button>
        </form>
      </FormProvider>
      <p className="mt-5 text-center text-sm">
        <Link
          className="text-primary underline-offset-4 hover:underline"
          to="/sign-in"
        >
          <FormattedMessage id="Retour à la connexion" />
        </Link>
      </p>
    </AuthLayout>
  )
}
