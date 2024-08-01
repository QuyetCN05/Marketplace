import { Cart } from "./cart"

export interface Profile {
  id: number
  userId: number
  username: string
  avatarUrl: string
  bannerUrl: string
  bio: string
}

export interface User {
  id: number
  email: string
  walletBalance: number
  profile: Profile
  cart: Cart
}

export interface UserAuth {
  accessToken: string
}
