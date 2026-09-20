import { zodResolver } from '@hookform/resolvers/zod'
import { Link, createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { FormattedMessage, useIntl } from 'react-intl'
import { Button } from '@/components/button/Button'
import { AuthLayout } from '../modules/auth/client/components/AuthLayout'
import { FormField } from '../modules/auth/client/components/FormField'
import { authClient } from '../modules/auth/client'
import {
  forgotPasswordSchema,
  type ForgotPasswordValues
} from '../modules/auth/shared/formSchemas'

export const Route = createFileRoute('/forgot-password')({
  component: ForgotPasswordPage
})

function ForgotPasswordPage() {
  const { formatMessage } = useIntl()
  const [error, setError] = useState<string>()
  const [isSubmitted, setIsSubmitted] = useState(false)
  const form = useForm<ForgotPasswordValues>({
    defaultValues: { email: '' },
    resolver: zodResolver(forgotPasswordSchema)
  })

  const onSubmit = form.handleSubmit(async ({ email }) => {
    setError(undefined)
    const result = await authClient.requestPasswordReset({
      email,
      redirectTo: `${window.location.origin}/reset-password`
    })

    if (result.error) {
      setError(
        result.error.message ??
          formatMessage({ id: 'La demande de réinitialisation a échoué.' })
      )
      return
    }

    setIsSubmitted(true)
  })

  return (
    <AuthLayout
      description={
        <FormattedMessage id="Nous vous enverrons un lien pour choisir un nouveau mot de passe." />
      }
      title={<FormattedMessage id="Mot de passe oublié" />}
    >
      {isSubmitted ? (
        <p className="rounded-md bg-secondary p-4 text-sm" role="status">
          <FormattedMessage id="Si cette adresse correspond à un compte, un e-mail de réinitialisation vient d’être envoyé." />
        </p>
      ) : (
        <FormProvider {...form}>
          <form className="grid gap-5" noValidate onSubmit={onSubmit}>
            <FormField<ForgotPasswordValues>
              autoComplete="email"
              label={formatMessage({ id: 'Adresse e-mail' })}
              name="email"
              type="email"
            />
            {error && (
              <p className="text-sm text-destructive" role="alert">
                {error}
              </p>
            )}
            <Button disabled={form.formState.isSubmitting} type="submit">
              <FormattedMessage id="Envoyer le lien de réinitialisation" />
            </Button>
          </form>
        </FormProvider>
      )}
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
