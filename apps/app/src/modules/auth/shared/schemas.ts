import { z } from 'zod'

export const authSessionSchema = z.object({
  user: z.object({
    id: z.string(),
    name: z.string(),
    email: z.string().email(),
    emailVerified: z.boolean(),
    firstname: z.string().nullable(),
    lastname: z.string().nullable()
  })
})

export type AuthSession = z.infer<typeof authSessionSchema>
