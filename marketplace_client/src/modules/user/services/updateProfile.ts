import { useMutation } from "@tanstack/react-query"
import { api } from "configs/api"
import { Profile } from "types/user"

export interface UpdateProfileRequest extends Partial<Profile> {
  username: string
}
export interface UpdateProfileResponse extends Profile {}

export async function updateProfile(data: FormData) {
  return (await api.patch<UpdateProfileResponse>("/user/profile", data)).data
}

export function useUpdateProfile() {
  return useMutation({
    mutationFn: updateProfile,
  })
}
