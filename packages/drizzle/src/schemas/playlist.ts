import {
  integer,
  pgTable,
  serial,
  timestamp,
  varchar
} from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm'
import { user } from './user'

export const playlist = pgTable('playlist', {
  id: serial('id').primaryKey(),
  title: varchar('title').notNull(),
  userId: integer('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at', { mode: 'date' })
    .notNull()
    .default(sql`now()`),
  updatedAt: timestamp('updated_at', { mode: 'date' })
    .notNull()
    .default(sql`now()`)
    .$onUpdate(() => new Date())
})

export type Playlist = typeof playlist.$inferSelect
export type NewPlaylist = typeof playlist.$inferInsert
