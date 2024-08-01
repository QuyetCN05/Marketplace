import User from '#models/user'
import { Secret } from '@adonisjs/core/helpers'

export default interface IGoogleAuth {
  user: User
  accessToken: string | Secret<string>
}
