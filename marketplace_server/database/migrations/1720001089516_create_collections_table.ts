import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'collections'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name', 255).notNullable()
      table.float('floor_price').notNullable().defaultTo(0)
      table.text('description').notNullable()
      table.float('total_volume').notNullable().defaultTo(0)
      table
        .integer('profile_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('profiles')
        .onDelete('CASCADE')
      table
        .integer('category_id')
        .unsigned()
        .references('id')
        .inTable('categories')
        .onDelete('CASCADE')
      table.string('image_url', 255).notNullable().defaultTo('')
      table.string('banner_url', 255).notNullable().defaultTo('')
      table.boolean('is_deleted').defaultTo(false)
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
