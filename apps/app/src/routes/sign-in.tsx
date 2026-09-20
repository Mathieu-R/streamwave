import { zodResolver } from '@hookform/resolvers/zod'
import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { Chrome, Github } from 'lucide-react'
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { FormattedMessage, useIntl } from 'react-intl'
import { Button } from '@/components/button/Button'
import { AuthLayout } from '../modules/auth/client/components/AuthLayout'
import { FormField } from '../modules/auth/client/components/FormField'
import { authClient } from '../modules/auth/client'
import {
  signInSchema,
  type SignInValues
} from '../modules/auth/shared/formSchemas'

export const Route = createFileRoute('/sign-in')({
  component: SignInPage
})

function SignInPage() {
  const { formatMessage } = useIntl()
  const navigate = useNavigate()
  const [error, setError] = useState<string>()
  const form = useForm<SignInValues>({
    defaultValues: { email: '', password: '' },
    resolver: zodResolver(signInSchema)
  })

  const onSubmit = form.handleSubmit(async (values) => {
    setError(undefined)
    const result = await authClient.signIn.email({
      ...values,
      callbackURL: '/'
    })

    if (result.error) {
      setError(
        result.error.message ?? formatMessage({ id: 'La connexion a échoué.' })
      )
      return
    }

    await navigate({ to: '/' })
  })

  const onSocialSignIn = async (provider: 'github' | 'google') => {
    setError(undefined)
    const result = await authClient.signIn.social({
      callbackURL: '/',
      provider
    })

    if (result.error) {
      setError(
        result.error.message ?? formatMessage({ id: 'La connexion a échoué.' })
      )
    }
  }

  return (
    <AuthLayout
      description={
        <FormattedMessage id="Connectez-vous pour retrouver votre musique." />
      }
      title={<FormattedMessage id="Connexion à Streamwave" />}
    >
      <FormProvider {...form}>
        <form className="grid gap-5" noValidate onSubmit={onSubmit}>
          <FormField<SignInValues>
            autoComplete="email"
            label={formatMessage({ id: 'Adresse e-mail' })}
            name="email"
            type="email"
          />
          <FormField<SignInValues>
            autoComplete="current-password"
            label={formatMessage({ id: 'Mot de passe' })}
            name="password"
            type="password"
          />
          {error && (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          )}
          <Button disabled={form.formState.isSubmitting} type="submit">
            <FormattedMessage id="Se connecter" />
          </Button>
        </form>
      </FormProvider>
      <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
        <div className="h-px flex-1 bg-border" />
        <FormattedMessage id="ou" />
        <div className="h-px flex-1 bg-border" />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Button
          onClick={() => onSocialSignIn('google')}
          type="button"
          variant="outline"
        >
          <Chrome aria-hidden="true" />
          <FormattedMessage id="Continuer avec Google" />
        </Button>
        <Button
          onClick={() => onSocialSignIn('github')}
          type="button"
          variant="outline"
        >
          <Github aria-hidden="true" />
          <FormattedMessage id="Continuer avec GitHub" />
        </Button>
      </div>
      <div className="mt-5 flex justify-between text-sm">
        <Link
          className="text-primary underline-offset-4 hover:underline"
          to="/forgot-password"
        >
          <FormattedMessage id="Mot de passe oublié ?" />
        </Link>
        <Link
          className="text-primary underline-offset-4 hover:underline"
          to="/sign-up"
        >
          <FormattedMessage id="Créer un compte" />
        </Link>
      </div>
    </AuthLayout>
  )
}
