import { BaseModel, column, manyToMany } from '@adonisjs/lucid/orm'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import Product from './product.js'

export default class Cart extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  @column()
  declare totalPrice: number

  @column()
  declare isDeleted: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @manyToMany(() => Product, {
    pivotTable: 'cart_products', // Tên bảng trung gian
    localKey: 'id', // Khóa chính của Cart
    pivotForeignKey: 'cart_id', // Khóa ngoại trong bảng trung gian đại diện cho Cart
    relatedKey: 'id', // Khóa chính của Product
    pivotRelatedForeignKey: 'product_id', // Khóa ngoại trong bảng trung gian đại diện cho Product
  })
  declare products: ManyToMany<typeof Product>
}
