import Album from '#models/album'

export type AlbumQueryResult = ReturnType<AlbumRepository['toJSON']>

export default class AlbumRepository {
  toJSON(album: Album) {
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
      tracks: album.tracks.map((track) => ({
        id: track.id,
        number: track.number,
        title: track.title,
        artist: track.artist,
        duration: track.duration,
        manifestUrl: track.manifestUrl,
        playlistUrl: track.playlistUrl,
        audio128Url: track.audio128Url,
        audio192Url: track.audio192Url,
        audio256Url: track.audio256Url,
      })),
    }
  }

  async getAlbum(id: number) {
    const album = await Album.query().where('id', id).preload('tracks').firstOrFail()
    return this.toJSON(album)
  }
}
