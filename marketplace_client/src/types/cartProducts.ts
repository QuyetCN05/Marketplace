import { Product } from "./product"

export interface CartProducts {
  id: number
  cartId: number
  productId: number
  quantity: number
  product: Product
}
