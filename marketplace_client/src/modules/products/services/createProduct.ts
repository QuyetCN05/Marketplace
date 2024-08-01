import { api } from "configs/api"
import { Product } from "types/product"

export interface createProductDTO {
  name: string
  price: number
  description: string
  quantity: number
  collection_id: number
}

export interface ProductCreatedResponse {
  message: string
  data: Product
}

export async function createProduct(productDTO: FormData) {
  return (await api.post<ProductCreatedResponse>("/products", productDTO)).data
}
