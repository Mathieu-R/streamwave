import { Link, useNavigate } from '@tanstack/react-router'
import { Link as ChakraLink, Stack, Text } from '@chakra-ui/react'
import { FormattedMessage, useIntl } from 'react-intl'
import { AuthenticationLayout } from '@/components/auth/AuthenticationLayout'
import { FormView } from '@/components/form/FormView'
import { PasswordInput } from '@/components/inputs/PasswordInput'
import { toaster } from '@/components/toast/Toaster'
import { authClient } from '../client'
import {
  resetPasswordSchema,
  type ResetPasswordValues
} from '../shared/formSchemas'

type ResetPasswordPageProps = { token?: string }

export const ResetPasswordPage = ({ token }: ResetPasswordPageProps) => {
  const { formatMessage } = useIntl()
  const navigate = useNavigate()

  const onSubmit = async ({ password }: ResetPasswordValues) => {
    if (!token) {
      toaster.create({
        title: formatMessage({
          id: 'Ce lien de réinitialisation est invalide ou a expiré.'
        }),
        type: 'error'
      })
      return
    }

    const result = await authClient.resetPassword({
      newPassword: password,
      token
    })

    if (result.error) {
      toaster.create({
        title:
          result.error.message ??
          formatMessage({
            id: 'La réinitialisation du mot de passe a échoué.'
          }),
        type: 'error'
      })
      return
    }

    await navigate({ to: '/sign-in' })
  }

  return (
    <AuthenticationLayout
      description={
        <FormattedMessage id="Choisissez un nouveau mot de passe sécurisé." />
      }
      title={<FormattedMessage id="Réinitialiser le mot de passe" />}
    >
      <Stack gap={6}>
        <FormView
          schema={resetPasswordSchema}
          initialValues={{ password: '', passwordConfirmation: '' }}
          isLoading={!token}
          onSubmit={onSubmit}
          options={{
            submit: {
              title: <FormattedMessage id="Réinitialiser le mot de passe" />
            }
          }}
          renderForm={({ field }) => (
            <Stack gap={4}>
              <PasswordInput
                autoComplete="new-password"
                label={<FormattedMessage id="Nouveau mot de passe" />}
                name={field('password')}
              />
              <PasswordInput
                autoComplete="new-password"
                label={<FormattedMessage id="Confirmer le mot de passe" />}
                name={field('passwordConfirmation')}
              />
            </Stack>
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
