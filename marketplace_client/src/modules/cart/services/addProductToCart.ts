import { useMutation } from "@tanstack/react-query"
import { api } from "configs/api"
import { Cart } from "types/cart"

export interface AddProductToCartRequest {
  cartId: number
  productId: number
  quantity?: number
}
export interface AddProductToCartResponse extends Cart {}

export async function addProductToCart(data: AddProductToCartRequest) {
  return (await api.post<AddProductToCartResponse>("/cart", data)).data
}

export function useAddProductToCart() {
  return useMutation({
    mutationFn: addProductToCart,
  })
}
