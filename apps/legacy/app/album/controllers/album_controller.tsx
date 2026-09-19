import { HttpContext } from '@adonisjs/core/http'
import AlbumRepository from '../repositories/album_repository.js'
import { inject } from '@adonisjs/core'

import TracklistPage from '#views/pages/tracklist'

@inject()
export default class AlbumController {
  constructor(private repository: AlbumRepository) {}

  async index({ request }: HttpContext) {
    const id = request.param('id')
    const album = await this.repository.getAlbum(id)

    return <TracklistPage album={album} type={'album'} />
  }
}
