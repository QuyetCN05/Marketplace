import ValidatorException from '#exceptions/validator_exception'
import { updateProfile } from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import { UpdateProfileDTO } from '../dto/update_profile.dto.js'

export default class ValidatorUpdateProfileMiddleware {
  async handle(ctx: HttpContext<UpdateProfileDTO>, next: NextFn) {
    try {
      const payload = await ctx.request.validateUsing(updateProfile)

      ctx.body = payload
    } catch (error) {
      throw new ValidatorException(error.messages)
    }

    /**
     * Call next method in the pipeline and return its output
     */
    const output = await next()
    return output
  }
}
