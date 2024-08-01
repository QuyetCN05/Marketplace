import { useInfiniteQuery } from "@tanstack/react-query"
import { api } from "configs/api"
import { Collection } from "types/collection"
import { BaseGetList, PageParam } from "types/getList"

export interface GetCollectionListRequest {
  limit?: number
  page: number
  keyword?: string
  categoryId?: number
}

export interface GetCollectionListResponse extends BaseGetList {
  data: Collection[]
}

export async function getCollectionList(params: GetCollectionListRequest) {
  return (
    await api.get<GetCollectionListResponse>(`/collections`, {
      params,
    })
  ).data
}

export function useGetCollectionList(
  req: Omit<GetCollectionListRequest, "page">,
  enabled?: boolean,
) {
  return useInfiniteQuery({
    queryKey: ["getCollectionList", req.limit, req.keyword, req.categoryId],

    queryFn: async ({ pageParam }) =>
      await getCollectionList({
        limit: req.limit ?? 12,
        page: pageParam.page,
        keyword: req.keyword,
        categoryId: req.categoryId,
      }),

    initialPageParam: {
      page: 1,
    } as PageParam,
    getNextPageParam: (lastPage) => {
      if (!lastPage) {
        return
      }

      const { currentPage, perPage, total } = lastPage.meta

      if (currentPage * perPage > total) {
        return
      }

      return {
        page: currentPage + 1,
      }
    },
    enabled,
  })
}
