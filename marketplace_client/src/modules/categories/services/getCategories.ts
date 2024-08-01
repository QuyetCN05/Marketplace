import { useQuery } from "@tanstack/react-query"
import { api } from "configs/api"
import { Category } from "types/category"

export interface GetCategoriesResponse {
  data: Category[]
}

async function getCategories() {
  return (await api.get<GetCategoriesResponse>("/categories")).data.data
}

export default function useGetCategories() {
  return useQuery({
    queryKey: ["getCategories"],
    queryFn: getCategories,
  })
}