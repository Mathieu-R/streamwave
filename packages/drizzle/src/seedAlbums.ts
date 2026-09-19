import { cdnDataDirectory } from '@streamwave/cdn'
import { parse } from 'csv-parse/sync'
import { eq } from 'drizzle-orm'
import type { PgDatabase, PgQueryResultHKT } from 'drizzle-orm/pg-core'
import { getColor, type RGBColor } from 'colorthief'
import { access, readFile, readdir } from 'node:fs/promises'
import { resolve } from 'node:path'
import type * as schema from './schema'
import { album, databaseSeed, track } from './schema'

const albumSeedName = 'albums'

type MetadataRow = {
  album: string
  artist: string
  album_artist: string
  title: string
  year: string
  genre: string
  track_number: string
  duration: string
  cover_url: string
  manifest_url: string
  playlist_url: string
  audio128_url: string
  audio192_url: string
  audio256_url: string
}

type AlbumSeed = {
  artist: string
  title: string
  year: number
  genre: string
  coverUrl: string
  primaryColor: RGBColor
  tracks: Array<{
    number: number
    title: string
    artist: string
    duration: number
    manifestUrl: string
    playlistUrl: string
    audio128Url: string
    audio192Url: string
    audio256Url: string
  }>
}

export type SeedAlbumsOptions = {
  mediaDir?: string
  getPrimaryColor?: (coverPath: string) => Promise<RGBColor | null>
}

function toInteger(value: string, field: string, metadataPath: string): number {
  const parsed = Number.parseInt(value, 10)

  if (Number.isNaN(parsed)) {
    throw new Error(`Invalid ${field} in ${metadataPath}`)
  }

  return parsed
}

async function loadAlbums(
  mediaDir: string,
  getPrimaryColor: (coverPath: string) => Promise<RGBColor | null>
): Promise<AlbumSeed[]> {
  await access(mediaDir)
  const artists = await readdir(mediaDir, { withFileTypes: true })
  const albums: AlbumSeed[] = []

  for (const artist of artists
    .filter((entry) => entry.isDirectory())
    .sort((a, b) => a.name.localeCompare(b.name))) {
    const artistPath = resolve(mediaDir, artist.name)
    const albumDirectories = await readdir(artistPath, { withFileTypes: true })

    for (const albumDirectory of albumDirectories
      .filter((entry) => entry.isDirectory())
      .sort((a, b) => a.name.localeCompare(b.name))) {
      const metadataPath = resolve(
        artistPath,
        albumDirectory.name,
        'metadata.csv'
      )
      const csv = await readFile(metadataPath, 'utf8')
      const metadata = parse(csv, {
        columns: true,
        skip_empty_lines: true,
        delimiter: ';'
      }) as MetadataRow[]
      const firstTrack = metadata[0]

      if (!firstTrack) {
        throw new Error(`Missing metadata rows in ${metadataPath}`)
      }

      const coverPath = resolve(mediaDir, firstTrack.cover_url)
      const primaryColor = await getPrimaryColor(coverPath)

      if (!primaryColor) {
        throw new Error(
          `Unable to determine the primary color for ${coverPath}`
        )
      }

      albums.push({
        artist: firstTrack.album_artist,
        title: firstTrack.album,
        year: toInteger(firstTrack.year, 'year', metadataPath),
        genre: firstTrack.genre,
        coverUrl: firstTrack.cover_url,
        primaryColor,
        tracks: metadata.map((row) => ({
          number: toInteger(row.track_number, 'track_number', metadataPath),
          title: row.title,
          artist: row.artist,
          duration: toInteger(row.duration, 'duration', metadataPath),
          manifestUrl: row.manifest_url,
          playlistUrl: row.playlist_url,
          audio128Url: row.audio128_url,
          audio192Url: row.audio192_url,
          audio256Url: row.audio256_url
        }))
      })
    }
  }

  return albums
}

export async function seedAlbums(
  db: PgDatabase<PgQueryResultHKT, typeof schema>,
  options: SeedAlbumsOptions = {}
): Promise<boolean> {
  const mediaDir =
    options.mediaDir ?? process.env.STREAMWAVE_MEDIA_DIR ?? cdnDataDirectory
  const getPrimaryColor = options.getPrimaryColor ?? getColor

  const alreadySeeded = await db
    .select({ name: databaseSeed.name })
    .from(databaseSeed)
    .where(eq(databaseSeed.name, albumSeedName))
    .limit(1)

  if (alreadySeeded.length > 0) {
    return false
  }

  const albums = await loadAlbums(mediaDir, getPrimaryColor)

  return db.transaction(async (tx) => {
    const completedSeed = await tx
      .select({ name: databaseSeed.name })
      .from(databaseSeed)
      .where(eq(databaseSeed.name, albumSeedName))
      .limit(1)

    if (completedSeed.length > 0) {
      return false
    }

    for (const albumSeed of albums) {
      const [createdAlbum] = await tx
        .insert(album)
        .values({
          artist: albumSeed.artist,
          title: albumSeed.title,
          year: albumSeed.year,
          genre: albumSeed.genre,
          coverUrl: albumSeed.coverUrl,
          primaryColorR: albumSeed.primaryColor[0],
          primaryColorG: albumSeed.primaryColor[1],
          primaryColorB: albumSeed.primaryColor[2]
        })
        .returning({ id: album.id })

      if (!createdAlbum) {
        throw new Error(`Unable to create album ${albumSeed.title}`)
      }

      await tx.insert(track).values(
        albumSeed.tracks.map((trackSeed) => ({
          ...trackSeed,
          albumId: createdAlbum.id
        }))
      )
    }

    await tx.insert(databaseSeed).values({ name: albumSeedName })
    return true
  })
}
