import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'albums'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.string('title').notNullable()
      table.string('artist').notNullable()
      table.string('genre').notNullable()
      table.smallint('year').notNullable()
      table.string('cover_url').notNullable()
      table.smallint('primary_color_r').notNullable().checkBetween([0, 255])
      table.smallint('primary_color_g').notNullable().checkBetween([0, 255])
      table.smallint('primary_color_b').notNullable().checkBetween([0, 255])

      table
        .integer('owner_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
        .nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
