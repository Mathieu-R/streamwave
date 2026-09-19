import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Preview,
  Text
} from '@react-email/components'
import React from 'react'
import type { AuthEmail } from './index'

function getPreview(type: AuthEmail['type']) {
  return type === 'verify-email'
    ? 'Confirmez votre adresse e-mail Streamwave.'
    : 'Réinitialisez votre mot de passe Streamwave.'
}

export function AuthEmailTemplate({ email }: { email: AuthEmail }) {
  const action =
    email.type === 'verify-email'
      ? 'Confirmer mon adresse'
      : 'Réinitialiser mon mot de passe'

  return (
    <Html>
      <Head />
      <Preview>{getPreview(email.type)}</Preview>
      <Body>
        <Container>
          <Text>Bonjour {email.name},</Text>
          <Text>{getPreview(email.type)}</Text>
          <Button href={email.url}>{action}</Button>
        </Container>
      </Body>
    </Html>
  )
}
