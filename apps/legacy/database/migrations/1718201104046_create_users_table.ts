import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()

      table.string('firstname').notNullable()
      table.string('lastname').notNullable()
      table.string('email').notNullable()
      table.string('password').notNullable()
      table.string('avatar_url').notNullable().defaultTo('/resources/assets/svg/avatar.svg')
      table.enum('provider', ['LOCAL', 'GOOGLE', 'GITHUB']).notNullable()

      table.string('email_verification_token').nullable()
      table.timestamp('email_verification_token_expired_at').nullable()
      // external provider will have this field as true
      table.boolean('email_verified').notNullable().defaultTo(false)

      table.string('reset_password_token').nullable()
      table.timestamp('reset_password_token_expired_at').nullable()

      table.timestamp('created_at').notNullable().defaultTo(this.now())
      table.timestamp('updated_at').notNullable().defaultTo(this.now())

      table.unique(['email', 'provider'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
