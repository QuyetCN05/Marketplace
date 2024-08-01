import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class PaginationMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    /**
     * Middleware logic goes here (before the next call)
     */
    // cclea

    const { request } = ctx

    const pagination = {
      page: parseInt(request.input('page', 1)),
      limit: parseInt(request.input('limit', 20)),
      keyword: request.input('keyword', ''),
      sort: request.input('sort', 'id'),
    }
    ctx.pagination = pagination

    /**
     * Call next method in the pipeline and return its output
     */
    const output = await next()
    return output
  }
}
