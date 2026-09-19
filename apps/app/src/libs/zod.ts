import z from 'zod'

export const idSchema = z
  .string()
  .regex(/^[1-9]\d*$/)
  .max(50)
  .refine((id) => Number.isSafeInteger(Number(id)))
