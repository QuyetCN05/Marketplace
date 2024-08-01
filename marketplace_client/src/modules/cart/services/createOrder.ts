import { useMutation } from "@tanstack/react-query"
import { api } from "configs/api"

export interface CartItem {
  product_id: number
  quantity: number
  price: number
}

export interface CreateOrderRequest {
  cart_items: Omit<CartItem, "price">[]
}
export interface CreateOrderResponse {
  data: {
    walletBalance: number
  }
}

export async function createOrder(data: CreateOrderRequest) {
  return (await api.post<CreateOrderResponse>("/order", data)).data.data
}

export function useCreateOrder() {
  return useMutation({
    mutationFn: createOrder,
  })
}
