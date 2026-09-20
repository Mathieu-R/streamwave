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
  signUpSchema,
  type SignUpValues
} from '../modules/auth/shared/formSchemas'

export const Route = createFileRoute('/sign-up')({
  component: SignUpPage
})

function SignUpPage() {
  const { formatMessage } = useIntl()
  const [error, setError] = useState<string>()
  const [isSubmitted, setIsSubmitted] = useState(false)
  const form = useForm<SignUpValues>({
    defaultValues: {
      firstname: '',
      lastname: '',
      email: '',
      password: '',
      passwordConfirmation: ''
    },
    resolver: zodResolver(signUpSchema)
  })

  const onSubmit = form.handleSubmit(
    async ({ firstname, lastname, email, password }) => {
      setError(undefined)
      const result = await authClient.signUp.email({
        email,
        firstname,
        lastname,
        name: `${firstname} ${lastname}`,
        password
      })

      if (result.error) {
        setError(
          result.error.message ??
            formatMessage({ id: 'La création du compte a échoué.' })
        )
        return
      }

      setIsSubmitted(true)
    }
  )

  return (
    <AuthLayout
      description={<FormattedMessage id="Créez votre compte Streamwave." />}
      title={<FormattedMessage id="Créer un compte" />}
    >
      {isSubmitted ? (
        <p className="rounded-md bg-secondary p-4 text-sm" role="status">
          <FormattedMessage id="Votre compte est créé. Consultez vos e-mails pour le valider." />
        </p>
      ) : (
        <FormProvider {...form}>
          <form className="grid gap-5" noValidate onSubmit={onSubmit}>
            <div className="grid gap-5 sm:grid-cols-2">
              <FormField<SignUpValues>
                autoComplete="given-name"
                label={formatMessage({ id: 'Prénom' })}
                name="firstname"
              />
              <FormField<SignUpValues>
                autoComplete="family-name"
                label={formatMessage({ id: 'Nom' })}
                name="lastname"
              />
            </div>
            <FormField<SignUpValues>
              autoComplete="email"
              label={formatMessage({ id: 'Adresse e-mail' })}
              name="email"
              type="email"
            />
            <FormField<SignUpValues>
              autoComplete="new-password"
              label={formatMessage({ id: 'Mot de passe' })}
              name="password"
              type="password"
            />
            <FormField<SignUpValues>
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
            <Button disabled={form.formState.isSubmitting} type="submit">
              <FormattedMessage id="Créer mon compte" />
            </Button>
          </form>
        </FormProvider>
      )}
      <p className="mt-5 text-center text-sm text-muted-foreground">
        <FormattedMessage id="Vous avez déjà un compte ?" />{' '}
        <Link
          className="text-primary underline-offset-4 hover:underline"
          to="/sign-in"
        >
          <FormattedMessage id="Se connecter" />
        </Link>
      </p>
    </AuthLayout>
  )
}
