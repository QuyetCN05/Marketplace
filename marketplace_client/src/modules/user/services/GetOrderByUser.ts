import { useQuery } from "@tanstack/react-query"
import { api } from "configs/api"
import { Order } from "types/order"

export interface OrderResponse {
  orders: Order[]
}

export async function getOrderByUser(userId: string) {
  return (await api.get<OrderResponse>(`/orders/users/${userId}`)).data
}

export default function useGetOrderByUser(userId: string) {
  return useQuery({
    queryKey: ["getOrderByUser", userId],
    queryFn: async () => await getOrderByUser(userId),
  })
}
