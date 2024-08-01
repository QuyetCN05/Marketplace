export interface CreateOrderDto {
  user_id: number
  cart_items: { product_id: number; quantity: number }[]
}
