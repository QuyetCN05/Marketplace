import { useMutation } from "@tanstack/react-query"
import { api } from "configs/api"
import { User } from "types/user"

export interface GoogleAuthRequest {
  code: string
}

export interface GoogleAuthResponse {
  user: User
  accessToken: string
}

async function googleAuth(data: GoogleAuthRequest) {
  // eslint-disable-next-line no-debugger
  // debugger
  return (await api.post<GoogleAuthResponse>("/auth/user/google", data)).data
}

export function useGoogleAuth() {
  // eslint-disable-next-line no-debugger
  // debugger
  return useMutation({
    mutationFn: googleAuth,
  })
}
