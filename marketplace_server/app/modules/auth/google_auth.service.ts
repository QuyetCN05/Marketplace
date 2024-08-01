import User from '#models/user'
import db from '@adonisjs/lucid/services/db'
import IGoogleAuth from './types/GoogleAuth.type.js'

export default class GoogleAuthsService {
  async googleAuth(email: string): Promise<IGoogleAuth> {
    const user = await User.query().preload('profile').where({ email: email }).first()

    if (user) {
      //create token
      // eslint-disable-next-line unicorn/no-await-expression-member
      const accessToken = (await User.accessTokens.create(user)).value?.release() || ''

      return { user, accessToken: accessToken }
    } else {
      const data = await db.transaction(async (trx) => {
        const newUser = await User.create(
          {
            email,
          },
          { client: trx }
        )

        await newUser.related('profile').create(
          {
            username: email.split('@')[0],
          },
          { client: trx }
        )

        await newUser.related('cart').create({}, { client: trx })

        return newUser
      })

      const accessToken = (await User.accessTokens.create(data)).value?.release() || ''

      return { user: data, accessToken }
    }
  }
}
