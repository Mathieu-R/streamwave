import { prettyJSON } from 'hono/pretty-json'
import { logger } from 'hono/logger'
import { cors } from 'hono/cors'
import { Hono } from 'hono/quick'

type DevServerOptions = {
  disableLogger?: boolean
}

export const devServer = (app: Hono, options?: DevServerOptions) => {
  if (!options?.disableLogger) {
    app.use(logger())
  }
  return app.use(prettyJSON()).use(cors())
}
