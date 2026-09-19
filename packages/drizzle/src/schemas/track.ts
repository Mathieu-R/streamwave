import {
  integer,
  pgTable,
  serial,
  smallint,
  varchar
} from 'drizzle-orm/pg-core'
import { album } from './album'

export const track = pgTable('track', {
  id: serial('id').primaryKey(),
  number: smallint('number').notNull(),
  title: varchar('title').notNull(),
  artist: varchar('artist').notNull(),
  duration: integer('duration').notNull(),
  manifestUrl: varchar('manifest_url').notNull(),
  playlistUrl: varchar('playlist_url').notNull(),
  audio128Url: varchar('audio_128_url').notNull(),
  audio192Url: varchar('audio_192_url').notNull(),
  audio256Url: varchar('audio_256_url').notNull(),
  albumId: integer('album_id')
    .notNull()
    .references(() => album.id, { onDelete: 'cascade' })
})

export type Track = typeof track.$inferSelect
export type NewTrack = typeof track.$inferInsert
