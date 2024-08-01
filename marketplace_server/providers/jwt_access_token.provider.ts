import { AccessToken } from '@adonisjs/auth/access_tokens'
import { AccessTokensProviderContract } from '@adonisjs/auth/types/access_tokens'
import { RuntimeException } from '@adonisjs/core/exceptions'
import { Secret } from '@adonisjs/core/helpers'
import { LucidModel } from '@adonisjs/lucid/types/model'
import jwt, { Algorithm } from 'jsonwebtoken'
import lodash from 'lodash'
import { DateTime } from 'luxon'
import { JwtAccessTokenProviderOptions, JwtKey } from '../types/auth.js'

export class JwtKeyPair implements JwtKey {
  public readonly verificationKey: string
  public readonly secret: string

  constructor(publicKey: string, privateKey: string) {
    this.verificationKey = publicKey
    this.secret = privateKey
  }
}

export class JwtSecret implements JwtKey {
  public readonly verificationKey: string
  public readonly secret: string

  constructor(secret: string) {
    this.verificationKey = secret
    this.secret = secret
  }
}

export class JwtAccessTokenProvider<TokenableModel extends LucidModel>
  implements AccessTokensProviderContract<TokenableModel>
{
  static forModel<TokenableModel extends LucidModel>(
    model: JwtAccessTokenProviderOptions<TokenableModel>['tokenableModel'],
    options: Omit<JwtAccessTokenProviderOptions<TokenableModel>, 'tokenableModel'>
  ) {
    return new JwtAccessTokenProvider<TokenableModel>({ tokenableModel: model, ...options })
  }

  private algorithm: Algorithm

  private getExtraPayload: (user: InstanceType<TokenableModel>) => Record<string, any>

  constructor(protected options: JwtAccessTokenProviderOptions<TokenableModel>) {
    this.algorithm = options.algorithm ?? 'HS256'
    this.getExtraPayload = options.extraPayload ?? (() => ({}))
  }

  async create(
    user: InstanceType<TokenableModel>,
    abilities?: string[],
    options?: {
      iat?: DateTime
      expiresIn?: number
    }
  ): Promise<AccessToken> {
    this.ensureIsPersisted(user)

    const expiresInMillis = options?.expiresIn ?? this.options.expiresInMillis

    const userId = user.$primaryKeyValue!

    const iat = options?.iat ?? DateTime.now()
    const exp = iat.plus({ milliseconds: expiresInMillis })

    const jwtToken = jwt.sign(
      lodash.merge(
        {
          [this.options.primaryKey]: userId,
        },
        this.getExtraPayload(user),
        {
          exp: lodash.floor(exp.toSeconds()),
        }
      ),
      this.options.key.secret,
      { algorithm: this.algorithm, issuer: this.options.issuer, audience: this.options.audience }
    )

    return lodash.tap(
      new AccessToken({
        identifier: userId,
        tokenableId: userId,
        type: 'jwt',
        name: 'jwt',
        hash: '',
        abilities: abilities ?? [],
        createdAt: iat.toJSDate(),
        updatedAt: iat.toJSDate(),
        lastUsedAt: iat.toJSDate(),
        expiresAt: exp.toJSDate(),
      }),
      (accessToken) => {
        accessToken.value = new Secret(jwtToken)
      }
    )
  }

  async verify(tokenValue: Secret<string>): Promise<AccessToken | null> {
    const jwtToken = tokenValue.release()

    if (!jwtToken) {
      return null
    }

    try {
      const payload = jwt.verify(jwtToken, this.options.key.verificationKey, {
        algorithms: [this.algorithm],
        issuer: this.options.issuer,
        audience: this.options.audience,
      }) as Record<string, any>

      const userId = payload[this.options.primaryKey]

      if (lodash.isNil(userId)) {
        return null
      }

      return lodash.tap(
        new AccessToken({
          identifier: userId,
          tokenableId: userId,
          type: 'jwt',
          name: 'jwt',
          hash: '',
          abilities: [],
          createdAt: DateTime.now().toJSDate(),
          updatedAt: DateTime.now().toJSDate(),
          lastUsedAt: DateTime.now().toJSDate(),
          expiresAt: DateTime.fromMillis(payload.exp * 1000).toJSDate(),
        }),
        (accessToken) => {
          accessToken.value = tokenValue
        }
      )
    } catch {
      return null
    }
  }

  ensureIsPersisted(user: InstanceType<TokenableModel>) {
    const model = this.options.tokenableModel
    if (user instanceof model === false) {
      throw new RuntimeException(
        `Invalid user object. It must be an instance of the "${model.name}" model`
      )
    }

    if (!user.$primaryKeyValue) {
      throw new RuntimeException(
        `Cannot use "${model.name}" model for managing access tokens. The value of column "${model.primaryKey}" is undefined or null`
      )
    }
  }
}
