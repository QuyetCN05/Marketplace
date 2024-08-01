import { useMutation } from "@tanstack/react-query"
import { api } from "configs/api"
import { Cart } from "types/cart"

export interface ChangeQuantityProductFromCartRequest {
  productId: number
  cartId: number
  quantity: number
}
export interface ChangeQuantityProductFromCartResponse extends Cart {}

export async function changeQuantityProductFromCart(
  data: ChangeQuantityProductFromCartRequest,
) {
  return (
    await api.patch<ChangeQuantityProductFromCartResponse>(
      "/cart/change-quantity-product",
      data,
    )
  ).data
}

export function useChangeQuantityProductFromCart() {
  return useMutation({
    mutationFn: changeQuantityProductFromCart,
  })
}
