import { PGlite } from '@electric-sql/pglite'
import { call } from '@orpc/server'
import { createDb } from '@streamwave/drizzle/drizzle'
import { album, track } from '@streamwave/drizzle/schema'
import { migrate } from 'drizzle-orm/pglite/migrator'
import { describe, expect, it } from 'vitest'
import { albumRouter } from './albumRouter'

async function createTestDb() {
  const client = new PGlite()
  const db = createDb(client)
  await migrate(db, { migrationsFolder: 'packages/drizzle/drizzle' })
  return db
}

async function seedAlbum() {
  const db = await createTestDb()
  const [createdAlbum] = await db
    .insert(album)
    .values({
      title: 'Discovery',
      artist: 'Daft Punk',
      genre: 'Electronic',
      year: 2001,
      coverUrl: 'discovery.jpg',
      primaryColorR: 12,
      primaryColorG: 34,
      primaryColorB: 56
    })
    .returning({ id: album.id })

  await db.insert(track).values({
    number: 1,
    title: 'One More Time',
    artist: 'Daft Punk',
    duration: 320,
    manifestUrl: 'manifest.mpd',
    playlistUrl: 'playlist.m3u8',
    audio128Url: 'audio-128.mp3',
    audio192Url: 'audio-192.mp3',
    audio256Url: 'audio-256.mp3',
    albumId: createdAlbum.id
  })

  return { db, id: createdAlbum.id }
}

describe('albumRouter', () => {
  it('returns the legacy album DTO with its tracks', async () => {
    const { db, id } = await seedAlbum()

    await expect(
      call(albumRouter.getAlbum, { id: id.toString() }, { context: { db } })
    ).resolves.toEqual({
      id: id.toString(),
      title: 'Discovery',
      artist: 'Daft Punk',
      genre: 'Electronic',
      year: 2001,
      coverUrl: 'discovery.jpg',
      primaryColorR: 12,
      primaryColorG: 34,
      primaryColorB: 56,
      tracks: [
        {
          id: '1',
          number: 1,
          title: 'One More Time',
          artist: 'Daft Punk',
          duration: 320,
          manifestUrl: 'manifest.mpd',
          playlistUrl: 'playlist.m3u8',
          audio128Url: 'audio-128.mp3',
          audio192Url: 'audio-192.mp3',
          audio256Url: 'audio-256.mp3'
        }
      ]
    })
  })

  it('rejects invalid IDs before querying the database', async () => {
    const db = await createTestDb()

    await expect(
      call(albumRouter.getAlbum, { id: '0' }, { context: { db } })
    ).rejects.toMatchObject({
      code: 'BAD_REQUEST'
    })
  })

  it('returns NOT_FOUND when the album does not exist', async () => {
    const db = await createTestDb()

    await expect(
      call(albumRouter.getAlbum, { id: '1' }, { context: { db } })
    ).rejects.toMatchObject({
      code: 'NOT_FOUND'
    })
  })
})
