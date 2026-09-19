import { eq } from 'drizzle-orm'
import { DrizzleClient } from '@streamwave/drizzle/drizzle'
import { album } from '@streamwave/drizzle/schema'
import { formatAlbum } from '../dto/albumFormat'

export async function getAlbumQuery(
  drizzle: DrizzleClient,
  { id }: { id: number }
) {
  return drizzle.query.album.findFirst({
    columns: {
      id: true,
      title: true,
      artist: true,
      genre: true,
      year: true,
      coverUrl: true,
      primaryColorR: true,
      primaryColorG: true,
      primaryColorB: true
    },
    with: {
      tracks: {
        columns: {
          id: true,
          number: true,
          title: true,
          artist: true,
          duration: true,
          manifestUrl: true,
          playlistUrl: true,
          audio128Url: true,
          audio192Url: true,
          audio256Url: true
        }
      }
    },
    where: eq(album.id, id)
  })
}

export type AlbumRecord = NonNullable<
  Awaited<ReturnType<typeof getAlbumQuery>>
>

export async function getAlbum(drizzle: DrizzleClient, { id }: { id: number }) {
  const record = await getAlbumQuery(drizzle, { id })
  return record ? formatAlbum(record) : null
}
