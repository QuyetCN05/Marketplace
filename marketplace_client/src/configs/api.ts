import axios, { AxiosHeaders } from "axios"
import { useUser } from "store/user"

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

api.interceptors.request.use((config) => {
  const accessToken = useUser.getState().auth.accessToken
  if (accessToken)
    (config.headers as AxiosHeaders).set(
      "Authorization",
      `Bearer ${accessToken}`,
    )
  return config
})
