import { useQuery } from "@tanstack/react-query"
import { api } from "configs/api"
import { Product } from "types/product"

export interface GetProductRequest {
  id: number
}

export interface GetProductResponse {
  data: Product & { productList: Product[] }
}

export async function getProduct({ id }: GetProductRequest) {
  return (await api.get<GetProductResponse>(`/products/${id}`)).data.data
}

export function useGetProduct(id: number) {
  return useQuery({
    queryKey: ["getProduct", id],
    queryFn: async () => await getProduct({ id }),
  })
}
