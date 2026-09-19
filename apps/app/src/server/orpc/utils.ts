import { os } from '@orpc/server'
import { DrizzleClient } from '@streamwave/drizzle/drizzle'

export const defaultProcedure = os.$context<{ db: DrizzleClient }>()
