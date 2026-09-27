import { Link } from '@tanstack/react-router'
import { Link as ChakraLink, Stack, Text } from '@chakra-ui/react'
import { FormattedMessage, useIntl } from 'react-intl'
import { AuthenticationLayout } from '@/components/auth/AuthenticationLayout'
import { FormView } from '@/components/form/FormView'
import { TextInput } from '@/components/inputs/TextInput'
import { toaster } from '@/components/toast/Toaster'
import { authClient } from '../client'
import {
  forgotPasswordSchema,
  type ForgotPasswordValues
} from '../shared/formSchemas'

export const ForgotPasswordPage = () => {
  const { formatMessage } = useIntl()

  const onSubmit = async ({ email }: ForgotPasswordValues) => {
    const result = await authClient.requestPasswordReset({
      email,
      redirectTo: `${window.location.origin}/reset-password`
    })

    if (result.error) {
      toaster.create({
        title:
          result.error.message ??
          formatMessage({ id: 'La demande de réinitialisation a échoué.' }),
        type: 'error'
      })
      return
    }

    toaster.create({
      title: formatMessage({
        id: 'Si cette adresse correspond à un compte, un e-mail de réinitialisation vient d’être envoyé.'
      }),
      type: 'success'
    })
  }

  return (
    <AuthenticationLayout
      description={
        <FormattedMessage id="Nous vous enverrons un lien pour choisir un nouveau mot de passe." />
      }
      title={<FormattedMessage id="Mot de passe oublié" />}
    >
      <Stack gap={6}>
        <FormView
          schema={forgotPasswordSchema}
          initialValues={{ email: '' }}
          onSubmit={onSubmit}
          options={{
            submit: {
              title: (
                <FormattedMessage id="Envoyer le lien de réinitialisation" />
              )
            }
          }}
          renderForm={({ field }) => (
            <TextInput
              autoComplete="email"
              label={<FormattedMessage id="Adresse e-mail" />}
              name={field('email')}
              type="email"
            />
          )}
        />
        <Text fontSize="sm" textAlign="center">
          <ChakraLink asChild color="colorPalette.fg">
            <Link to="/sign-in">
              <FormattedMessage id="Retour à la connexion" />
            </Link>
          </ChakraLink>
        </Text>
      </Stack>
    </AuthenticationLayout>
  )
}
