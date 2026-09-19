import { authSessionSchema } from '../../shared/schemas'
import { getAuthSession } from '../utils/getAuthSession'
import { defaultProcedure } from '../../../../libs/orpc/utils'

export const getSession = defaultProcedure
  .output(authSessionSchema.nullable())
  .handler(({ context }) => getAuthSession(context.headers ?? new Headers()))
