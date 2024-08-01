import { api } from "configs/api"
import { Product } from "types/product"

export interface UpdateProductRequest extends Partial<Product> {}
export interface UpdateProductResponse {
  message: string
  data: Product
}

export async function updateProduct(
  data: UpdateProductRequest,
  productId: string,
) {
  return (
    await api.patch<UpdateProductResponse>(`/products/${productId}`, data)
  ).data
}
