import { Product } from "./product"

export interface Cart {
  id: number
  userId: number
  totalPrice: number
  products: Product[]
  totalProducts: number
}
