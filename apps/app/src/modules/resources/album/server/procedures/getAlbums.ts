import { z } from 'zod'
import { defaultProcedure } from '../../../../../libs/orpc/utils'
import { albumSummarySchema } from '../../shared/schemas'
import { getAlbums as getAlbumsUtils } from '../utils/getAlbums'

export const getAlbums = defaultProcedure
  .output(z.array(albumSummarySchema))
  .handler(({ context }) => getAlbumsUtils(context.db))
