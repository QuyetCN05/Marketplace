import { useMutation } from "@tanstack/react-query"
import { api } from "configs/api"
import { Cart } from "types/cart"

export interface RemoveProductFromCartRequest {
  productId: number
}
export interface RemoveProductFromCartResponse extends Cart {}

export async function removeProductFromCart(
  data: RemoveProductFromCartRequest,
) {
  return (
    await api.delete<RemoveProductFromCartResponse>("/cart", {
      data: data,
    })
  ).data
}

export function useRemoveProductFromCart() {
  return useMutation({
    mutationFn: removeProductFromCart,
  })
}
