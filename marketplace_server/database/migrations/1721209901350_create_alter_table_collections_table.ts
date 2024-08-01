import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'collections'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table
        .integer('created_by_user_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
    })
  }

  async down() {
    this.schema.table(this.tableName, (table) => {
      table.dropColumn('created_by_user_id')
    })
  }
}
