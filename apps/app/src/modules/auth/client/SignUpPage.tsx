import { Link } from '@tanstack/react-router'
import { Link as ChakraLink, SimpleGrid, Stack, Text } from '@chakra-ui/react'
import { FormattedMessage, useIntl } from 'react-intl'
import { AuthenticationLayout } from '@/components/auth/AuthenticationLayout'
import { FormView } from '@/components/form/FormView'
import { PasswordInput } from '@/components/inputs/PasswordInput'
import { TextInput } from '@/components/inputs/TextInput'
import { toaster } from '@/components/toast/Toaster'
import { authClient } from '../client'
import { signUpSchema, type SignUpValues } from '../shared/formSchemas'

export const SignUpPage = () => {
  const { formatMessage } = useIntl()

  const onSubmit = async ({
    firstname,
    lastname,
    email,
    password
  }: SignUpValues) => {
    const result = await authClient.signUp.email({
      email,
      firstname,
      lastname,
      name: `${firstname} ${lastname}`,
      password
    })

    if (result.error) {
      toaster.create({
        title:
          result.error.message ??
          formatMessage({ id: 'La création du compte a échoué.' }),
        type: 'error'
      })
      return
    }

    toaster.create({
      title: formatMessage({
        id: 'Votre compte est créé. Consultez vos e-mails pour le valider.'
      }),
      type: 'success'
    })
  }

  return (
    <AuthenticationLayout
      description={<FormattedMessage id="Créez votre compte Streamwave." />}
      title={<FormattedMessage id="Créer un compte" />}
    >
      <Stack gap={6}>
        <FormView
          schema={signUpSchema}
          initialValues={{
            firstname: '',
            lastname: '',
            email: '',
            password: '',
            passwordConfirmation: ''
          }}
          onSubmit={onSubmit}
          options={{
            submit: { title: <FormattedMessage id="Créer mon compte" /> }
          }}
          renderForm={({ field }) => (
            <Stack gap={4}>
              <SimpleGrid columns={{ base: 1, sm: 2 }} gap={5}>
                <TextInput
                  autoComplete="given-name"
                  label={<FormattedMessage id="Prénom" />}
                  name={field('firstname')}
                />
                <TextInput
                  autoComplete="family-name"
                  label={<FormattedMessage id="Nom" />}
                  name={field('lastname')}
                />
              </SimpleGrid>
              <TextInput
                autoComplete="email"
                label={<FormattedMessage id="Adresse e-mail" />}
                name={field('email')}
                type="email"
              />
              <PasswordInput
                autoComplete="new-password"
                label={<FormattedMessage id="Mot de passe" />}
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
        <Text color="fg.muted" fontSize="sm" textAlign="center">
          <FormattedMessage id="Vous avez déjà un compte ?" />{' '}
          <ChakraLink asChild color="colorPalette.fg">
            <Link to="/sign-in">
              <FormattedMessage id="Se connecter" />
            </Link>
          </ChakraLink>
        </Text>
      </Stack>
    </AuthenticationLayout>
  )
}
