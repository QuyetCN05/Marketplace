import Cart from '#models/cart'
import CartProduct from '#models/cartProducts'
import { AddProductToCartDto } from './dto/add_product_to_cart.dto.js'
import { ChangeQuantityProductFromCartDto } from './dto/change_quantity_product_from_cart.dto.js'
import { GetCartDto } from './dto/get_cart.dto.js'
import { RemoveProductFromCartDto } from './dto/remove_product_from_cart.dto.js'

export default class CartService {
  async addProductToCart({ cartId, productId, quantity }: AddProductToCartDto) {
    const cartProduct = await CartProduct.findBy({
      cartId,
      productId,
    })

    if (!cartProduct) {
      return await CartProduct.create({
        cartId,
        productId,
        quantity: quantity || 1,
      })
    }
  }

  async removeProductFromCart(userId: number, { productId }: RemoveProductFromCartDto) {
    const cartId = (await Cart.findByOrFail('userId', userId)).id

    const cartProduct = await CartProduct.query()
      .where({
        cartId,
        productId,
      })
      .delete()

    return cartProduct
  }

  async removeAllProductFromCart(userId: number) {
    const cartId = (await Cart.findByOrFail('userId', userId)).id

    const cartProduct = await CartProduct.query()
      .where({
        cartId,
      })
      .delete()

    return cartProduct
  }

  async changeQuantityProductFromCart({
    cartId,
    productId,
    quantity,
  }: ChangeQuantityProductFromCartDto) {
    const cartProduct = await CartProduct.findByOrFail({
      cartId,
      productId,
    })

    if (!cartProduct) {
      throw new Error('Cannot find cart or product')
    }

    return await cartProduct.merge({ quantity }).save()
  }

  async getCart(data: GetCartDto) {
    const cart = await Cart.findByOrFail('user_id', data.userId)

    await cart.load('products')

    return cart
  }
}
