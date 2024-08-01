import { BaseSchema } from '@adonisjs/lucid/schema'

export default class AddQuantityToCartProducts extends BaseSchema {
  protected tableName = 'cart_products'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      // Thêm cột quantity
      table.integer('quantity').notNullable().defaultTo(1)
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      // Xóa cột quantity
      table.dropColumn('quantity')
    })
  }
}
