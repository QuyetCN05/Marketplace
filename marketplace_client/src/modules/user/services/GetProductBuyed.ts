import { useQuery } from "@tanstack/react-query"
import { api } from "configs/api"
import { Product } from "types/product"

export interface ProductBuyedResponse {
  data: Product[]
}

export async function getProductBuyed(userId: string) {
  return (
    await api.get<ProductBuyedResponse>(`/orders/users/products/${userId}`)
  ).data.data
}

export default function useGetProductBuyed(userId: string) {
  return useQuery({
    queryKey: ["getProductBuyed", userId],
    queryFn: async () => await getProductBuyed(userId),
  })
}
