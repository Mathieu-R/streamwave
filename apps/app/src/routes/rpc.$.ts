import { RPCHandler } from '@orpc/server/fetch'
import { createFileRoute } from '@tanstack/react-router'
import { db } from '../libs/drizzle'
import { appRouter } from '../libs/orpc/appRouter'

const handler = new RPCHandler(appRouter)

export const Route = createFileRoute('/rpc/$')({
  server: {
    handlers: {
      ANY: async ({ request }) => {
        const result = await handler.handle(request, {
          prefix: '/rpc',
          context: { db, headers: request.headers }
        })

        return result.response ?? new Response('Not Found', { status: 404 })
      }
    }
  }
})
