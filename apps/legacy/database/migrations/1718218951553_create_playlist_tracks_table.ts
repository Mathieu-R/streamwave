import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'playlist_track'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table
        .integer('playlist_id')
        .unsigned()
        .references('id')
        .inTable('playlists')
        .onDelete('CASCADE')
      table.integer('track_id').unsigned().references('id').inTable('tracks').onDelete('CASCADE')

      table.primary(['playlist_id', 'track_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
