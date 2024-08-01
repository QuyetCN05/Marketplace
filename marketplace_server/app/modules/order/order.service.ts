import Order from '#models/order'
import OrderDetail from '#models/order_detail'
import Product from '#models/product'
import User from '#models/user'
import db from '@adonisjs/lucid/services/db'
import { CreateOrderDto } from './dto/create_order.dto.js'

export default class OrderService {
  async createOrderFromCart(data: CreateOrderDto) {
    const { user_id, cart_items } = data

    return await db.transaction(async (trx) => {
      const user = await User.findByOrFail('id', user_id, {
        client: trx,
      })

      const total_price = (
        await Promise.all(
          cart_items.map(async (item) => {
            const product = await Product.query({
              client: trx,
            })
              .where('id', item.product_id)
              .andWhere('isDeleted', false)
              .andWhere('quantity', '>', item.quantity)
              .first()

            if (!product) {
              throw new Error('Product does not have enough quantity.')
            }

            await product
              .related('user')
              .query()
              .increment('walletBalance', product.price * item.quantity)

            await product
              .merge({
                quantity: product.quantity - item.quantity,
              })
              .save()

            return {
              product,
              quantity: item.quantity,
            }
          })
        )
      ).reduce((prevs: number, curr) => {
        if (curr.product.price) {
          return (prevs += curr.product.price * curr.quantity)
        }
        return prevs
      }, 0)

      if (user.walletBalance < total_price) {
        throw new Error('Not enough money')
      }

      await user
        .merge({
          walletBalance: Number(user.walletBalance) - Number(total_price),
        })
        .save()

      const cart = await user.related('cart').query().firstOrFail()

      await cart.related('products').detach([], trx)

      const order = new Order()
      order.description = ''
      order.paymentMethod = 'online'
      order.totalPrice = total_price
      order.userId = user_id

      order.useTransaction(trx)
      await order.save()
      const listOrderDetail = []
      for (const cartItem of cart_items) {
        const orderDetail = new OrderDetail()
        const productId = cartItem.product_id
        const quantity = cartItem.quantity
        const product = await Product.findOrFail(productId, { client: trx })
        orderDetail.orderId = order.id
        orderDetail.productId = productId
        orderDetail.numberProduct = quantity
        orderDetail.price = product.price
        listOrderDetail.push(orderDetail)
      }
      await OrderDetail.createMany(listOrderDetail, {
        client: trx,
      })

      return {
        walletBalance: user.walletBalance,
      }
    })
  }
  async getOrderByUserId(userId: number) {
    return Order.query().where('userId', userId).andWhere('isDeleted', false)
  }

  async getProductIsBuyed(userID: number) {
    const listOrder = await this.getOrderByUserId(userID)
    const orderIds = listOrder.map((order: any) => order.id)
    const listOrderDetail = await OrderDetail.query().whereIn('orderId', orderIds)
    const productIds = listOrderDetail.map((orderDetail: any) => orderDetail.productId)
    return Product.query().whereIn('id', productIds)
  }
}
