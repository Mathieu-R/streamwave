import {
  check,
  integer,
  pgTable,
  serial,
  smallint,
  varchar
} from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm'
import { user } from './user'

export const album = pgTable(
  'album',
  {
    id: serial('id').primaryKey(),
    title: varchar('title').notNull(),
    artist: varchar('artist').notNull(),
    genre: varchar('genre').notNull(),
    year: smallint('year').notNull(),
    coverUrl: varchar('cover_url').notNull(),
    primaryColorR: smallint('primary_color_r').notNull(),
    primaryColorG: smallint('primary_color_g').notNull(),
    primaryColorB: smallint('primary_color_b').notNull(),
    ownerId: integer('owner_id').references(() => user.id, {
      onDelete: 'cascade'
    })
  },
  (table) => [
    check(
      'album_primary_color_r_check',
      sql`${table.primaryColorR} between 0 and 255`
    ),
    check(
      'album_primary_color_g_check',
      sql`${table.primaryColorG} between 0 and 255`
    ),
    check(
      'album_primary_color_b_check',
      sql`${table.primaryColorB} between 0 and 255`
    )
  ]
)

export type Album = typeof album.$inferSelect
export type NewAlbum = typeof album.$inferInsert
