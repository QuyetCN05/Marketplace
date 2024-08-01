import HttpStatusCode from '#responses/HttpStatusCode'
import { Exception } from '@adonisjs/core/exceptions'
import { HttpContext } from '@adonisjs/core/http'

export default class DatabaseException extends Exception {
  static status = HttpStatusCode.BAD_REQUEST
  static message: string | undefined = ''

  constructor(message?: string) {
    super()
    DatabaseException.message = message
  }

  async handle(error: this, ctx: HttpContext) {
    ctx.response.status(error.status).send({
      messages: DatabaseException.message,
    })
  }
}
