import { useQuery } from "@tanstack/react-query"
import { api } from "configs/api"

export interface OrderDetailProductResponse {
  name: string
  imageUrl: string
  numberProduct: number
}

export interface OrderDetailResponse {
  products: OrderDetailProductResponse[]
}

async function getListProductByOrderId(orderId: string) {
  return (await api.get<OrderDetailResponse>(`order-details/orders/${orderId}`))
    .data
}

export default function useGetListProductByOrderId(orderId: string) {
  return useQuery({
    queryKey: ["getListProductByOrderId", orderId],
    queryFn: async () => await getListProductByOrderId(orderId),
  })
}
