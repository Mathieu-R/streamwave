import { PGlite } from '@electric-sql/pglite'
import { RPCHandler } from '@orpc/server/fetch'
import { createDb } from '@streamwave/drizzle/drizzle'
import { album } from '@streamwave/drizzle/schema'
import { migrate } from 'drizzle-orm/pglite/migrator'
import { describe, expect, it } from 'vitest'
import { appRouter } from './appRouter'

describe('appRouter', () => {
  it('routes album.getAlbum through the /rpc handler', async () => {
    const client = new PGlite()
    const db = createDb(client)
    await migrate(db, { migrationsFolder: 'packages/drizzle/drizzle' })
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
    const handler = new RPCHandler(appRouter)

    const result = await handler.handle(
      new Request('http://localhost/rpc/album/getAlbum', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          json: { id: createdAlbum.id.toString() },
          meta: []
        })
      }),
      { prefix: '/rpc', context: { db } }
    )

    if (!result.matched) {
      throw new Error('Expected the RPC handler to match album.get')
    }

    expect(result.response.status).toBe(200)
    await expect(result.response.json()).resolves.toMatchObject({
      json: { id: createdAlbum.id.toString(), tracks: [] }
    })
  })
})
