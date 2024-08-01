import { Collection } from "./collection"

export interface Product {
  id: number
  name: string
  description: string
  price: number
  quantity: number
  collectionId: number
  collection: Collection
  imageUrl: string
  createdAt: Date
}
