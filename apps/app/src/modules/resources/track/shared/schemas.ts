import z from 'zod'
import { idSchema } from '../../../../libs/zod'

export const trackSchema = z.object({
  id: idSchema,
  number: z.number().int(),
  title: z.string(),
  artist: z.string(),
  duration: z.number().int(),
  manifestUrl: z.string(),
  playlistUrl: z.string(),
  audio128Url: z.string(),
  audio192Url: z.string(),
  audio256Url: z.string()
})

export type Track = z.infer<typeof trackSchema>
