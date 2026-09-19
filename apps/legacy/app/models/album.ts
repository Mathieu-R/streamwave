import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import User from '#models/user'
import Track from '#models/track'

export default class Album extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare artist: string

  @column()
  declare title: string

  @column()
  declare year: number

  @column()
  declare genre: string

  @column()
  declare coverUrl: string

  @column()
  declare primaryColorR: number

  @column()
  declare primaryColorG: number

  @column()
  declare primaryColorB: number

  @column()
  declare ownerId: number | null

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User> | null

  @hasMany(() => Track)
  declare tracks: HasMany<typeof Track>
}
