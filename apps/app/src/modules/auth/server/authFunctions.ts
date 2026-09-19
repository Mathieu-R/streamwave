import { sendAuthEmail } from '@streamwave/mail'
import { inngest } from '@streamwave/inngest'
import type { AuthEmail } from '@streamwave/mail'

export const sendAuthEmailFunction = inngest.createFunction(
  {
    id: 'send-auth-email',
    retries: 3,
    triggers: { event: 'auth/email.requested' }
  },
  ({ event, step }) =>
    step.run('send-email', () => sendAuthEmail(event.data as AuthEmail))
)
