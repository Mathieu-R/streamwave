import { albumRouter } from '../../modules/resources/album/server/albumRouter'
import { authRouter } from '../../modules/auth/server/authRouter'

export const appRouter = {
  auth: authRouter,
  album: albumRouter
}
