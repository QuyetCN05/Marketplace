import { useQuery } from "@tanstack/react-query"
import { api } from "configs/api"
import { collectionEdit } from "types/collectionEdit"

export interface CollectionIsCreatedResponse {
  collections: collectionEdit[]
}

export async function getCollectionCreated(userId: string) {
  return (
    await api.get<CollectionIsCreatedResponse>(`/collections/users/${userId}`)
  ).data
}

export default function useGetCollectionCreated(userId: string) {
  return useQuery({
    queryKey: ["getCollectionCreated", userId],
    queryFn: async () => await getCollectionCreated(userId),
  })
}
