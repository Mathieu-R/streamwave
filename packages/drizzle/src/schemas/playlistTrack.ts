import { integer, pgTable, primaryKey } from 'drizzle-orm/pg-core'
import { playlist } from './playlist'
import { track } from './track'

export const playlistTrack = pgTable(
  'playlist_track',
  {
    playlistId: integer('playlist_id')
      .notNull()
      .references(() => playlist.id, { onDelete: 'cascade' }),
    trackId: integer('track_id')
      .notNull()
      .references(() => track.id, { onDelete: 'cascade' })
  },
  (table) => [primaryKey({ columns: [table.playlistId, table.trackId] })]
)

export type PlaylistTrack = typeof playlistTrack.$inferSelect
export type NewPlaylistTrack = typeof playlistTrack.$inferInsert
