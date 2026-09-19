import Album from '#models/album'
import { HttpContext } from '@adonisjs/core/http'

function albumDTO(album: Album) {
  return {
    id: album.id,
    title: album.title,
    artist: album.artist,
    genre: album.genre,
    year: album.year,
    coverUrl: album.coverUrl,
    primaryColorR: album.primaryColorR,
    primaryColorG: album.primaryColorG,
    primaryColorB: album.primaryColorB,
  }
}

export default class LibraryController {
  async index({ response }: HttpContext) {
    const albums = await Album.query().orderBy('year', 'desc')
    return response.ok(albums.map(albumDTO))
  }
}
