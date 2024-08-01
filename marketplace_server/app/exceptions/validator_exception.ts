import HttpStatusCode from '#responses/HttpStatusCode'
import { Exception } from '@adonisjs/core/exceptions'
import { HttpContext } from '@adonisjs/core/http'

export default class ValidatorException extends Exception {
  static status = HttpStatusCode.BAD_REQUEST
  static messages?: any[] | undefined = []
  constructor(messages?: any[]) {
    super()
    ValidatorException.messages = messages
  }

  async handle(error: this, ctx: HttpContext) {
    ctx.response.status(error.status).send({
      messages: ValidatorException.messages,
    })
  }
}
