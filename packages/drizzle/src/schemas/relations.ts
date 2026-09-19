import { relations } from 'drizzle-orm'
import { album } from './album'
import { playlist } from './playlist'
import { playlistTrack } from './playlistTrack'
import { track } from './track'
import { user } from './user'

export const userRelations = relations(user, ({ many }) => ({
  albums: many(album),
  playlists: many(playlist)
}))

export const albumRelations = relations(album, ({ one, many }) => ({
  owner: one(user, {
    fields: [album.ownerId],
    references: [user.id]
  }),
  tracks: many(track)
}))

export const trackRelations = relations(track, ({ one, many }) => ({
  album: one(album, {
    fields: [track.albumId],
    references: [album.id]
  }),
  playlistTracks: many(playlistTrack)
}))

export const playlistRelations = relations(playlist, ({ one, many }) => ({
  user: one(user, {
    fields: [playlist.userId],
    references: [user.id]
  }),
  playlistTracks: many(playlistTrack)
}))

export const playlistTrackRelations = relations(playlistTrack, ({ one }) => ({
  playlist: one(playlist, {
    fields: [playlistTrack.playlistId],
    references: [playlist.id]
  }),
  track: one(track, {
    fields: [playlistTrack.trackId],
    references: [track.id]
  })
}))
