import { useQuery } from "@tanstack/react-query"
import { api } from "configs/api"
import { useUser } from "store/user"
import { User } from "types/user"

export interface GetUserProfileResponse extends User {}

export async function getUserProfile() {
  return (await api.get<GetUserProfileResponse>("/user/profile")).data
}

export function useGetUserProfile(enabled?: boolean) {
  return useQuery({
    queryKey: [
      "getUserProfile",
      useUser.getState().user.email,
      useUser.getState().auth.accessToken,
    ],
    queryFn: getUserProfile,
    refetchInterval: 3000,
    enabled,
  })
}
