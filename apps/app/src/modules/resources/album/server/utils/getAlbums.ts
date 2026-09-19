import { desc } from 'drizzle-orm'
import { DrizzleClient } from '@streamwave/drizzle/drizzle'
import { album } from '@streamwave/drizzle/schema'
import { formatAlbumSummary } from '../dto/albumFormat'

export async function getAlbums(drizzle: DrizzleClient) {
  const records = await drizzle.query.album.findMany({
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
    orderBy: desc(album.year)
  })

  return records.map(formatAlbumSummary)
}
