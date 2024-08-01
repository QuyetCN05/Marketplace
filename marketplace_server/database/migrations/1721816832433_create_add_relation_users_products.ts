import { BaseSchema } from '@adonisjs/lucid/schema'

export default class AddUserIdToProducts extends BaseSchema {
  protected tableName = 'products'

  public async up() {
    this.schema.table(this.tableName, (table) => {
      table
        .integer('owner_by_user_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
    })
  }

  public async down() {
    this.schema.table(this.tableName, (table) => {
      table.dropColumn('owner_by_user_id')
    })
  }
}
