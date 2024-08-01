import { Exception } from '@adonisjs/core/exceptions'
import { HttpContext } from '@adonisjs/core/http'

export default class DataNotFoundException extends Exception {
  static status = 500
  static message = 'Data not found'

  async handle(error: this, ctx: HttpContext) {
    ctx.response.status(error.status).send({
      message: DataNotFoundException.message,
    })
  }
}
