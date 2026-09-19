import { PGlite } from '@electric-sql/pglite'
import { eq } from 'drizzle-orm'
import { migrate } from 'drizzle-orm/pglite/migrator'
import { access, mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'
import { createDb } from './drizzle'
import { album, databaseSeed, track } from './schema'
import { seedAlbums } from './seedAlbums'

const temporaryDirectories: string[] = []

async function createTestDb() {
  const client = new PGlite()
  const db = createDb(client)
  await migrate(db, { migrationsFolder: './drizzle' })
  return db
}

async function createMediaDirectory(metadata: string): Promise<string> {
  const directory = await mkdtemp(join(tmpdir(), 'streamwave-seed-'))
  temporaryDirectories.push(directory)
  const albumDirectory = join(directory, 'artist', 'album')
  await mkdir(albumDirectory, { recursive: true })
  await writeFile(join(albumDirectory, 'metadata.csv'), metadata)
  return directory
}

const validMetadata = `album;artist;album_artist;title;year;genre;track_number;duration;cover_url;manifest_url;playlist_url;audio128_url;audio192_url;audio256_url
Album;Track Artist;Album Artist;First Track;2024;Classical;01;120.4;artist/album/cover.jpg;manifest.mpd;playlist.m3u8;128.mp4;192.mp4;256.mp4
Album;Track Artist;Album Artist;Second Track;2024;Classical;02;180;artist/album/cover.jpg;manifest-2.mpd;playlist-2.m3u8;128-2.mp4;192-2.mp4;256-2.mp4
`

afterEach(async () => {
  await Promise.all(
    temporaryDirectories
      .splice(0)
      .map((directory) => rm(directory, { recursive: true, force: true }))
  )
})

describe('seedAlbums', () => {
  it('seeds albums and tracks once', async () => {
    const db = await createTestDb()
    const mediaDir = await createMediaDirectory(validMetadata)

    await expect(
      seedAlbums(db, {
        mediaDir,
        getPrimaryColor: async () => [1, 2, 3]
      })
    ).resolves.toBe(true)

    expect(await db.select().from(album)).toHaveLength(1)
    expect(await db.select().from(track)).toHaveLength(2)
    expect(await db.select().from(databaseSeed)).toHaveLength(1)
    expect(
      await seedAlbums(db, {
        mediaDir,
        getPrimaryColor: async () => [1, 2, 3]
      })
    ).toBe(false)
  })

  it('rolls back album inserts when an insert fails', async () => {
    const db = await createTestDb()
    const mediaDir = await createMediaDirectory(validMetadata)

    await expect(
      seedAlbums(db, {
        mediaDir,
        getPrimaryColor: async () => [256, 2, 3]
      })
    ).rejects.toThrow()

    expect(await db.select().from(album)).toHaveLength(0)
    expect(await db.select().from(databaseSeed)).toHaveLength(0)
  })

  it('fails when the media directory is missing', async () => {
    const db = await createTestDb()

    await expect(
      seedAlbums(db, {
        mediaDir: join(tmpdir(), 'streamwave-seed-missing'),
        getPrimaryColor: async () => [1, 2, 3]
      })
    ).rejects.toThrow()

    expect(
      await db
        .select({ name: databaseSeed.name })
        .from(databaseSeed)
        .where(eq(databaseSeed.name, 'albums'))
    ).toHaveLength(0)
  })

  it('fails when an album cover is missing', async () => {
    const db = await createTestDb()
    const mediaDir = await createMediaDirectory(validMetadata)

    await expect(
      seedAlbums(db, {
        mediaDir,
        getPrimaryColor: async (coverPath) => {
          await access(coverPath)
          return [1, 2, 3]
        }
      })
    ).rejects.toThrow()

    expect(await db.select().from(databaseSeed)).toHaveLength(0)
  })
})
