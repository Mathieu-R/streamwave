import Album from '#models/album'

export type LibraryQueryResult = ReturnType<LibraryRepository['toJSON']>

export default class LibraryRepository {
  toJSON(albums: Album[]) {
    return albums.map((album) => ({
      id: album.id,
      title: album.title,
      artist: album.artist,
      genre: album.genre,
      year: album.year,
      coverUrl: album.coverUrl,
      primaryColorR: album.primaryColorR,
      primaryColorG: album.primaryColorG,
      primaryColorB: album.primaryColorB,
    }))
  }

  async getLibrary() {
    const albums = await Album.query().orderBy('year', 'desc')
    return this.toJSON(albums)
  }
}
