import { Link, useNavigate } from '@tanstack/react-router'
import { FormattedMessage, useIntl } from 'react-intl'
import {
  HStack,
  Link as ChakraLink,
  SimpleGrid,
  Button,
  Stack
} from '@chakra-ui/react'
import { AtSign, Lock } from 'lucide-react'
import { SiGithub, SiGoogle } from '@icons-pack/react-simple-icons'
import { authClient } from '../client'
import { signInSchema, type SignInValues } from '../shared/formSchemas'
import { AuthenticationLayout } from '@/components/auth/AuthenticationLayout'
import { SeparatorLabel } from '@/components/layout/SeparatorLabel'
import { TextInput } from '@/components/inputs/TextInput'
import { PasswordInput } from '@/components/inputs/PasswordInput'
import { FormView } from '@/components/form/FormView'
import { toaster } from '@/components/toast/Toaster'

type Provider = 'google' | 'github'

export const SignInPage = () => {
  const { formatMessage } = useIntl()
  const navigate = useNavigate()

  const onSubmit = async (values: SignInValues) => {
    const result = await authClient.signIn.email({
      ...values,
      callbackURL: '/'
    })

    if (result.error) {
      toaster.create({
        title:
          result.error.message ??
          formatMessage({ id: 'La connexion a échoué.' }),
        type: 'error'
      })
      return
    }

    await navigate({ to: '/' })
  }

  const onSocialSignIn = async (provider: Provider) => {
    const result = await authClient.signIn.social({
      callbackURL: '/',
      provider
    })

    if (result.error) {
      toaster.create({
        title:
          result.error.message ??
          formatMessage({ id: 'La connexion a échoué.' }),
        type: 'error'
      })
    }
  }

  return (
    <AuthenticationLayout
      title={<FormattedMessage id="Connexion à Streamwave" />}
      description={
        <FormattedMessage id="Connectez-vous pour retrouver votre musique." />
      }
    >
      <Stack gap={6}>
        <FormView
          schema={signInSchema}
          initialValues={{ email: '', password: '' }}
          onSubmit={onSubmit}
          options={{
            submit: {
              title: <FormattedMessage id="Se connecter" />
            }
          }}
          renderForm={({ field }) => {
            return (
              <Stack>
                <TextInput
                  label={<FormattedMessage id="email" />}
                  icon={<AtSign />}
                  name={field('email')}
                  autoComplete="email"
                  type="email"
                />
                <PasswordInput
                  label={<FormattedMessage id="mot de passe" />}
                  icon={<Lock />}
                  name={field('password')}
                  autoComplete="current-password"
                />
              </Stack>
            )
          }}
        />
        <SeparatorLabel label={<FormattedMessage id="ou" />} />

        <SimpleGrid columns={{ base: 1, sm: 2 }} gap={3}>
          <Button
            onClick={() => onSocialSignIn('google')}
            type="button"
            variant="outline"
          >
            <SiGoogle aria-hidden="true" />
            <FormattedMessage id="Continuer avec Google" />
          </Button>
          <Button
            onClick={() => onSocialSignIn('github')}
            type="button"
            variant="outline"
          >
            <SiGithub aria-hidden="true" />
            <FormattedMessage id="Continuer avec GitHub" />
          </Button>
        </SimpleGrid>

        <HStack fontSize="sm" justify="space-between">
          <ChakraLink asChild color="colorPalette.fg">
            <Link to="/forgot-password">
              <FormattedMessage id="Mot de passe oublié ?" />
            </Link>
          </ChakraLink>
          <ChakraLink asChild color="colorPalette.fg">
            <Link to="/sign-up">
              <FormattedMessage id="Créer un compte" />
            </Link>
          </ChakraLink>
        </HStack>
      </Stack>
    </AuthenticationLayout>
  )
}
