import { BaseModel, belongsTo, column, manyToMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, ManyToMany } from '@adonisjs/lucid/types/relations'
import Album from '#models/album'
import Playlist from '#models/playlist'

export default class Track extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare number: number

  @column()
  declare title: string

  @column()
  declare artist: string

  @column()
  declare duration: number

  @column()
  declare manifestUrl: string

  @column()
  declare playlistUrl: string

  @column()
  declare audio128Url: string

  @column()
  declare audio192Url: string

  @column()
  declare audio256Url: string

  @column()
  declare albumId: number

  @belongsTo(() => Album)
  declare album: BelongsTo<typeof Album>

  @manyToMany(() => Playlist)
  declare playlists: ManyToMany<typeof Playlist>
}
