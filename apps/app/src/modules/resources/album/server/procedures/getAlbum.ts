import { z } from 'zod'
import { albumSchema } from '../../shared/schemas'
import { idSchema } from '../../../../../libs/zod'
import { getAlbum as getAlbumUtils } from '../utils/getAlbum'
import { defaultProcedure } from '../../../../../server/orpc/utils'

export const getAlbum = defaultProcedure
  .input(
    z.object({
      id: idSchema
    })
  )
  .errors({ NOT_FOUND: {} })
  .output(albumSchema)
  .handler(async ({ input, context, errors }) => {
    const album = await getAlbumUtils(context.db, {
      id: parseInt(input.id, 10)
    })

    if (!album) {
      throw errors.NOT_FOUND()
    }

    return album
  })
