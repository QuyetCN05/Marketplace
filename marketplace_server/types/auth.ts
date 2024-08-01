import { LucidModel } from '@adonisjs/lucid/types/model'
import { Algorithm } from 'jsonwebtoken'

export interface JwtKey {
  verificationKey: string
  secret: string
}

export interface JwtAccessTokenProviderOptions<TokenableModel extends LucidModel> {
  tokenableModel: TokenableModel
  expiresInMillis: number
  key: JwtKey
  algorithm?: Algorithm
  primaryKey: string
  extraPayload?: (user: InstanceType<TokenableModel>) => Record<string, any>
  issuer?: string
  audience?: string
}
