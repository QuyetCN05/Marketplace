import { useQuery } from "@tanstack/react-query"
import { api } from "configs/api"
import { CartProducts } from "types/cartProducts"

export interface GetProductListFromCartRequest {
  cartId: number
}

export interface GetProductListFromCartResponse {
  data: CartProducts[]
}

export async function getProductListFromCart(
  params: GetProductListFromCartRequest,
) {
  return (
    await api.get<GetProductListFromCartResponse>(`/products-from-cart`, {
      params,
    })
  ).data.data
}

export function useGetProductListFromCart(cartId: number, enabled?: boolean) {
  return useQuery({
    queryKey: ["getProductListFromCart", cartId],
    queryFn: async () => await getProductListFromCart({ cartId }),
    enabled,
  })
}
