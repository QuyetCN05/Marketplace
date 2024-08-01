import { useQuery } from "@tanstack/react-query"
import { api } from "configs/api"
import { Collection } from "types/collection"

export interface GetTopCollectionsRequest {
  limit?: number
  categoryId?: number
  sortedBy?: "floor" | "volume"
}

export interface GetTopCollectionsResponse {
  data: Collection[]
}

async function getTopCollections({
  limit = 5,
  ...data
}: GetTopCollectionsRequest) {
  return (
    (
      await api.get<GetTopCollectionsResponse>("/top-collections", {
        params: {
          limit,
          ...data,
        },
      })
    ).data.data ?? null
  )
}

export default function useGetTopCollections(req: GetTopCollectionsRequest) {
  return useQuery({
    queryKey: ["getTopCollections", req.limit, req.categoryId, req.sortedBy],
    queryFn: async () => await getTopCollections(req),
  })
}
