import { useQuery } from "@tanstack/react-query"
import { api } from "configs/api"
import { Product } from "types/product"

export interface ProductIsCreatedResponse {
  products: Product[]
}

export async function getProductCreated(userId: string) {
  return (await api.get<ProductIsCreatedResponse>(`/products/users/${userId}`))
    .data
}

export default function useGetProductCreated(userId: string) {
  return useQuery({
    queryKey: ["getProductCreated", userId],
    queryFn: async () => await getProductCreated(userId),
  })
}
