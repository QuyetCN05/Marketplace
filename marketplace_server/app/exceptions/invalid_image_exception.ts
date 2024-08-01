import { Exception } from '@adonisjs/core/exceptions'
import { HttpContext } from '@adonisjs/core/http'

export default class InvalidImageException extends Exception {
  static status = 400
  static message = 'INVALID_IMAGE_FORMAT OR IMAGE_SIZE_TOO_LARGE'
  static code = 'INVALID_IMAGE'

  constructor(message?: string) {
    super()
    message ? (InvalidImageException.message = message) : InvalidImageException.message
  }

  async handle(error: this, ctx: HttpContext) {
    ctx.response.status(error.status).send({
      message: InvalidImageException.message,
    })
  }
}
