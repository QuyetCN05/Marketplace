import { useInfiniteQuery } from "@tanstack/react-query"
import { api } from "configs/api"
import { BaseGetList, PageParam } from "types/getList"
import { Product } from "types/product"

export interface GetProductListRequest {
  collectionId: number
  limit?: number
  page?: number
  keyword?: string
  sort?: string
  sortedBy?: string
  userId?: number
  minPrice?: number
  maxPrice?: number
}

export interface GetProductListResponse extends BaseGetList {
  data: Product[]
}

export async function getProductList(params: GetProductListRequest) {
  return (
    await api.get<GetProductListResponse>(`/products`, {
      params,
    })
  ).data
}

export function useGetProductList(
  data: GetProductListRequest,
  enabled?: boolean,
) {
  console.log(data.minPrice, data.maxPrice)
  return useInfiniteQuery({
    queryKey: [
      "getProductList",
      data.collectionId,
      data.limit,
      data.keyword,
      data.sort,
      data.sortedBy,
      data.minPrice,
      data.maxPrice,
      data.userId,
    ],

    queryFn: async ({ pageParam }) =>
      await getProductList({
        ...data,
        limit: data.limit ?? 15,
        page: pageParam.page,
      }),

    initialPageParam: {
      page: 1,
    } as PageParam,
    getNextPageParam: (lastPage) => {
      if (!lastPage.meta) {
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
