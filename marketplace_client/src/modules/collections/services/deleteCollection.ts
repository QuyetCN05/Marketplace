import { api } from "configs/api"

export interface DeleteCollectionResponse {
  message: string
}

export async function deleteCollection(userId: string, collectionId: string) {
  return (
    await api.delete<DeleteCollectionResponse>(
      `/users/${userId}/collections/${collectionId}`,
    )
  ).data
}
