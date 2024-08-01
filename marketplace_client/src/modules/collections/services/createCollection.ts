import { useMutation } from "@tanstack/react-query"
import { collectionEdit } from "types/collectionEdit.ts"
import { api } from "../../../configs/api.ts"

export interface createCollectionDTO {
  name: string
  floor_price: number
  description: string
  total_volume: number
  category_id: number
}

export interface CollectionCreatedResponse {
  messages: string
  data: collectionEdit
}

export async function createCollection(data: FormData) {
  return (await api.post<CollectionCreatedResponse>("/collections", data)).data
}

export function useCreateCollection() {
  return useMutation({
    mutationFn: createCollection,
  })
}
