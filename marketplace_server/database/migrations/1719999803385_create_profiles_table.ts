import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'profiles'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.string('username', 80).notNullable().unique()
      table
        .string('avatar_url', 255)
        .defaultTo('https://images.pexels.com/photos/45201/kitty-cat-kitten-pet-45201.jpeg')
      table.string('banner_url', 255).nullable()
      table.string('bio', 255).nullable()
      table.boolean('is_deleted').defaultTo(false)
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
