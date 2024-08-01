import { useMutation } from "@tanstack/react-query"
import { api } from "configs/api"
import { Cart } from "types/cart"

export interface RemoveAllProductFromCartResponse extends Cart {}

export async function removeAllProductFromCart() {
  return (await api.delete<RemoveAllProductFromCartResponse>("/cart/all")).data
}

export function useRemoveAllProductFromCart() {
  return useMutation({
    mutationFn: removeAllProductFromCart,
  })
}
