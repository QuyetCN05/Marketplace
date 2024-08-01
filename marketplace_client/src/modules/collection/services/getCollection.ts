import { useQuery } from "@tanstack/react-query"
import { api } from "configs/api"
import { Collection } from "types/collection"

export interface GetCollectionRequest {
  id: number
}

export interface GetCollectionResponse {
  data: Collection
}

export async function getCollection({ id }: GetCollectionRequest) {
  return (await api.get<GetCollectionResponse>(`/collections/${id}`)).data.data
}

export function useGetCollection(id: number, enabled: boolean) {
  return useQuery({
    queryKey: ["getCollection", id],
    queryFn: async () => await getCollection({ id }),
    enabled,
  })
}
