import { describe, expect, it } from 'vitest'
import { PGlite } from '@electric-sql/pglite'
import { eq, sql } from 'drizzle-orm'
import { migrate } from 'drizzle-orm/pglite/migrator'
import { createDb } from './drizzle'
import { album, playlist, playlistTrack, track, user } from './schema'

async function createTestDb() {
  const client = new PGlite()
  const db = createDb(client)
  await migrate(db, { migrationsFolder: './drizzle' })
  return db
}

describe('createDb', () => {
  it('pings PGlite', async () => {
    const client = new PGlite()
    const db = createDb(client)
    const result = await db.execute(sql`select 1 as ok`)
    const rows = 'rows' in result ? result.rows : result
    const first = Array.isArray(rows) ? rows[0] : undefined
    expect(first).toEqual({ ok: 1 })
  })

  it('enforces user email uniqueness and album color bounds', async () => {
    const db = await createTestDb()
    const [createdUser] = await db
      .insert(user)
      .values({
        id: 'ada',
        name: 'Ada Lovelace',
        email: 'ada@example.com',
        firstname: 'Ada',
        lastname: 'Lovelace'
      })
      .returning({ id: user.id })

    await expect(
      db.insert(user).values({
        id: 'ada-duplicate',
        name: 'Ada Lovelace',
        email: 'ada@example.com',
        firstname: 'Ada',
        lastname: 'Lovelace'
      })
    ).rejects.toThrow()

    await expect(
      db.insert(album).values({
        title: 'Invalid',
        artist: 'Artist',
        genre: 'Genre',
        year: 2024,
        coverUrl: 'cover',
        primaryColorR: 256,
        primaryColorG: 0,
        primaryColorB: 0,
        ownerId: createdUser.id
      })
    ).rejects.toThrow()
  })

  it('supports relations, composite playlist keys and cascades', async () => {
    const db = await createTestDb()
    const [createdUser] = await db
      .insert(user)
      .values({
        id: 'grace',
        name: 'Grace Hopper',
        email: 'grace@example.com',
        firstname: 'Grace',
        lastname: 'Hopper'
      })
      .returning({ id: user.id })
    const [createdAlbum] = await db
      .insert(album)
      .values({
        title: 'Compiler',
        artist: 'Grace Hopper',
        genre: 'Classical',
        year: 1952,
        coverUrl: 'cover',
        primaryColorR: 1,
        primaryColorG: 2,
        primaryColorB: 3,
        ownerId: createdUser.id
      })
      .returning({ id: album.id })
    const [createdTrack] = await db
      .insert(track)
      .values({
        number: 1,
        title: 'A-0',
        artist: 'Grace Hopper',
        duration: 120,
        manifestUrl: 'manifest',
        playlistUrl: 'playlist',
        audio128Url: 'audio-128',
        audio192Url: 'audio-192',
        audio256Url: 'audio-256',
        albumId: createdAlbum.id
      })
      .returning({ id: track.id })
    const [createdPlaylist] = await db
      .insert(playlist)
      .values({ title: 'Favorites', userId: createdUser.id })
      .returning({ id: playlist.id })

    await db.insert(playlistTrack).values({
      playlistId: createdPlaylist.id,
      trackId: createdTrack.id
    })
    await expect(
      db.insert(playlistTrack).values({
        playlistId: createdPlaylist.id,
        trackId: createdTrack.id
      })
    ).rejects.toThrow()

    await db.delete(user).where(eq(user.id, createdUser.id))
    expect(await db.select().from(album)).toHaveLength(0)
    expect(await db.select().from(track)).toHaveLength(0)
    expect(await db.select().from(playlist)).toHaveLength(0)
    expect(await db.select().from(playlistTrack)).toHaveLength(0)
  })
})
