import type { Album } from '../../shared/schemas'
import type { AlbumRecord } from '../utils/getAlbum'

export function formatAlbum(album: AlbumRecord): Album {
  return {
    id: album.id.toString(),
    title: album.title,
    artist: album.artist,
    genre: album.genre,
    year: album.year,
    coverUrl: album.coverUrl,
    primaryColorR: album.primaryColorR,
    primaryColorG: album.primaryColorG,
    primaryColorB: album.primaryColorB,
    tracks: album.tracks.map((track) => ({
      id: track.id.toString(),
      number: track.number,
      title: track.title,
      artist: track.artist,
      duration: track.duration,
      manifestUrl: track.manifestUrl,
      playlistUrl: track.playlistUrl,
      audio128Url: track.audio128Url,
      audio192Url: track.audio192Url,
      audio256Url: track.audio256Url
    }))
  }
}
