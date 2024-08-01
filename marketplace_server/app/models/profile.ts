import Collection from '#models/collection'
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import User from './user.js'

export default class Profile extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  @column()
  declare username: string

  @column()
  declare avatarUrl: string

  @column()
  declare bio: string

  @column()
  declare isDeleted: boolean

  @column()
  declare bannerUrl: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @hasMany(() => Collection)
  declare collections: HasMany<typeof Collection>

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>
}
