import HttpStatusCode from '#responses/HttpStatusCode'
import { createOrderValidator } from '#validators/order'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import { errors } from '@adonisjs/lucid'
import OrderService from './order.service.js'

@inject()
export default class OrdersController {
  constructor(private orderService: OrderService) {}
  /**
   * Display a list of resource
   */
  async index(ctx: HttpContext) {
    ctx.response.status(HttpStatusCode.OK).send({
      message: 'List of orders',
    })
  }

  /**
   * Handle form submission for the create action
   */
  async store(ctx: HttpContext) {
    try {
      const orderDTO = await createOrderValidator.validate(ctx.request.all())

      const order = await this.orderService.createOrderFromCart({
        user_id: ctx.auth.user!.id,
        ...orderDTO,
      })
      ctx.response.status(HttpStatusCode.CREATED).send({
        message: 'Order created',
        data: order,
      })
    } catch (error) {
      if (error instanceof errors.E_ROW_NOT_FOUND) {
        ctx.response.status(HttpStatusCode.NOT_FOUND).send({
          message: 'Cannot find user or product',
        })
      } else {
        ctx.response.status(HttpStatusCode.BAD_REQUEST).send({
          message: error.message,
          error: error.messages,
        })
      }
    }
  }

  async getProductIsBuyedByUser(ctx: HttpContext) {
    try {
      const listProducts = await this.orderService.getProductIsBuyed(ctx.params.id)
      ctx.response.status(HttpStatusCode.OK).send({
        message: 'successful',
        data: listProducts,
      })
    } catch (error) {
      ctx.response.status(HttpStatusCode.BAD_REQUEST).send({
        message: 'Cannot get product is buyed by user',
      })
    }
  }

  async getOrderByUser(ctx: HttpContext) {
    try {
      const listOrders = await this.orderService.getOrderByUserId(ctx.params.id)
      ctx.response.status(HttpStatusCode.OK).send({
        message: 'successful',
        orders: listOrders,
      })
    } catch (error) {
      ctx.response.status(HttpStatusCode.BAD_REQUEST).send({
        message: 'Cannot get order by user',
      })
    }
  }

  /**
   * Show individual record
   */
  // async show({ params }: HttpContext) {}

  // /**
  //  * Handle form submission for the edit action
  //  */
  // async update({ params, request }: HttpContext) {}

  // /**
  //  * Delete record
  //  */
  // async destroy({ params }: HttpContext) {}
}
