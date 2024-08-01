import Category from '#models/category'
import Product from '#models/product'
import User from '#models/user'

import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import Profile from './profile.js'

export default class Collection extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare description: string

  @column()
  declare floorPrice: number

  @column()
  declare isDeleted: boolean

  @column()
  declare totalVolume: number

  @column({ columnName: 'category_id' })
  declare categoryId: number

  @column()
  declare createdByUserId: number

  @column({ columnName: 'profile_id' })
  declare profileId: number

  @column()
  declare imageUrl: string

  @column()
  declare bannerUrl: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Category)
  declare category: BelongsTo<typeof Category>

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @belongsTo(() => Profile)
  declare profile: BelongsTo<typeof Profile>

  @hasMany(() => Product)
  declare products: HasMany<typeof Product>
}
