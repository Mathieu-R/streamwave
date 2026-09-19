import { z } from 'zod'
import { idSchema } from '../../../../libs/zod'
import { trackSchema } from '../../track/shared/schemas'

export const albumSchema = z.object({
  id: idSchema,
  title: z.string(),
  artist: z.string(),
  genre: z.string(),
  year: z.number().int(),
  coverUrl: z.string(),
  primaryColorR: z.number().int().min(0).max(255),
  primaryColorG: z.number().int().min(0).max(255),
  primaryColorB: z.number().int().min(0).max(255),
  tracks: z.array(trackSchema)
})

export type Album = z.infer<typeof albumSchema>
