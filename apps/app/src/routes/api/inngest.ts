import { serve, inngest } from '@streamwave/inngest'
import { createFileRoute } from '@tanstack/react-router'
import { sendAuthEmailFunction } from '../../modules/auth/server/authFunctions'

const handler = serve({
  client: inngest,
  functions: [sendAuthEmailFunction]
})

export const Route = createFileRoute('/api/inngest')({
  server: {
    handlers: {
      GET: ({ request }) => handler(request),
      POST: ({ request }) => handler(request),
      PUT: ({ request }) => handler(request)
    }
  }
})
