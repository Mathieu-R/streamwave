import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'tracks'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.smallint('number').notNullable()
      table.string('title').notNullable()
      table.string('artist').notNullable()
      // duration in seconds
      table.integer('duration').notNullable()
      table.string('manifest_url').notNullable()
      table.string('playlist_url').notNullable()
      table.string('audio_128_url').notNullable()
      table.string('audio_192_url').notNullable()
      table.string('audio_256_url').notNullable()

      table.integer('album_id').unsigned().references('id').inTable('albums').onDelete('CASCADE')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
