import HttpStatusCode from '#responses/HttpStatusCode'
import { validateParams } from '#validators/category'
import { createOrderDetailValidator } from '#validators/order_detail'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import { errors } from '@adonisjs/lucid'
import OrderDetailService from './order_detail.service.js'

@inject()
export default class OrderDetailsController {
  constructor(private orderDetailService: OrderDetailService) {}
  /**
   * Display a list of resource
   */
  async index(ctx: HttpContext) {
    try {
      const orderDetails = await this.orderDetailService.getAlllOrderDetails()
      ctx.response.status(HttpStatusCode.OK).send({
        message: 'Order details fetched successfully',
        data: orderDetails,
      })
    } catch (error) {
      ctx.response.status(HttpStatusCode.BAD_REQUEST).send({
        message: 'Cannot get order details',
      })
    }
  }

  /**
   * Handle form submission for the create action
   */
  async store(ctx: HttpContext) {
    try {
      const orderDetailDTO = await createOrderDetailValidator.validate(ctx.request.all())
      const orderDetail = await this.orderDetailService.createOrderDetail(orderDetailDTO)
      ctx.response.status(HttpStatusCode.CREATED).send({
        message: 'Order detail created successfully',
        data: orderDetail,
      })
    } catch (error) {
      if (error instanceof errors.E_ROW_NOT_FOUND) {
        ctx.response.status(HttpStatusCode.NOT_FOUND).send({
          message: 'Cannot find order or product',
        })
      } else {
        ctx.response.status(HttpStatusCode.BAD_REQUEST).send({
          message: 'Order Detail not found',
          error: error.messages,
        })
      }
    }
  }

  /**
   * Show individual record
   */
  // async show(ctx: HttpContext) {}

  /**
   * Handle form submission for the edit action
   */
  async update(ctx: HttpContext) {
    try {
      const id = await validateParams.validate(ctx.params.id)
      const data = ctx.request.all()
      const orderDetail = await this.orderDetailService.upDateOrderDetail(id, data)
      ctx.response.status(HttpStatusCode.OK).send({
        message: 'Order detail updated successfully',
        data: orderDetail,
      })
    } catch (error) {
      if (error instanceof errors.E_ROW_NOT_FOUND) {
        ctx.response.status(HttpStatusCode.NOT_FOUND).send({
          message: 'Order detail not found',
        })
      } else {
        ctx.response.status(HttpStatusCode.BAD_REQUEST).send({
          message: 'Cannot update order detail',
        })
      }
    }
  }

  async getListOrderDetailByOrderId(ctx: HttpContext) {
    try {
      const data = await this.orderDetailService.getListOrderDetailByOrderId(ctx.params.id)
      ctx.response.status(HttpStatusCode.OK).send({
        message: 'Order detail by order id',
        products: data,
      })
    } catch (error) {
      ctx.response.status(HttpStatusCode.BAD_REQUEST).send({
        message: 'Cannot get order detail by order id',
      })
    }
  }

  /**
   * Delete record
   */
  // async destroy(ctx: HttpContext) {}
}
