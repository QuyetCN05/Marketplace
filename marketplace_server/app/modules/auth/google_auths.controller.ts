import env from '#start/env'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import { OAuth2Client } from 'google-auth-library'
import { GoogleAuthsDto } from './dto/google_auth.dto.js'
import GoogleAuthsService from './google_auth.service.js'

@inject()
export default class GoogleAuthsController {
  private oAuth2Client: OAuth2Client

  constructor(private googleAuthsService: GoogleAuthsService) {
    this.oAuth2Client = new OAuth2Client(
      env.get('GOOGLE_CLIENT_ID'),
      env.get('GOOGLE_CLIENT_SECRET'),
      'postmessage'
    )
  }

  async googleAuth(ctx: HttpContext) {
    const { code } = ctx.request.body() as GoogleAuthsDto

    const {
      tokens: { access_token },
    } = await this.oAuth2Client.getToken(code)

    if (!access_token) {
      throw new Error('Bad request')
    }

    const { email } = await this.oAuth2Client.getTokenInfo(access_token)

    if (!email) {
      throw new Error('Bad request')
    }

    const data = await this.googleAuthsService.googleAuth(email)

    return ctx.response.send(data)
  }
}
