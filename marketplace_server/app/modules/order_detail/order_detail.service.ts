import Order from '#models/order'
import OrderDetail from '#models/order_detail'
import Product from '#models/product'

export default class OrderDetailService {
  async createOrderDetail(data: any) {
    const { order_id, product_id, price, number_product } = data

    const order = await Order.findOrFail(order_id)

    const product = await Product.findOrFail(product_id)
    const orderDetail = new OrderDetail()
    orderDetail.orderId = order.id
    orderDetail.productId = product.id
    orderDetail.price = price
    orderDetail.numberProduct = number_product
    await orderDetail.save()
    return orderDetail
  }

  async getAlllOrderDetails() {
    return OrderDetail.all()
  }

  async upDateOrderDetail(id: number, data: any) {
    const orderDetail = await OrderDetail.findOrFail(id)
    orderDetail.merge(data)
    await orderDetail.save()
    return orderDetail
  }

  async getListOrderDetailByOrderId(orderId: number) {
    const listOrderDetails = await OrderDetail.query().where('order_id', orderId)
    const listNumberProduct = listOrderDetails.map((orderDetail) => orderDetail.numberProduct)
    const listProducts = await Product.query().whereIn(
      'id',
      listOrderDetails.map((orderDetail) => orderDetail.productId)
    )
    // return listNumberProduct
    let result = []
    for (let i = 0; i < listProducts.length; i++) {
      const x = {
        ...listProducts[i].toJSON(),
        numberProduct: listNumberProduct[i],
      }
      result.push(x)
    }
    return result
  }
}
