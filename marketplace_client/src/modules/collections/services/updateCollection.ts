import { api } from "configs/api"
import { Collection } from "types/collection"

export interface UpdateCollectionRequest extends Partial<Collection> {}
export interface UpdateCollectionResponse {
  message: string
  data: Collection
}

export async function updateCollection(
  data: UpdateCollectionRequest,
  collectionId: string,
) {
  return (
    await api.patch<UpdateCollectionResponse>(
      `/collections/${collectionId}`,
      data,
    )
  ).data
}

// export function useUpdateCollection() {
//   return useMutation({
//     mutationFn: updateCollection,
//   })
// }
