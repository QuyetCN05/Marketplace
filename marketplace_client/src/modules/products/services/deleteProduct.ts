import { api } from "configs/api"

export interface DeleteProductResponse {
  message: string
}

export async function deleteProduct(productId: string) {
  return (await api.delete<DeleteProductResponse>(`/products/${productId}`))
    .data
}
