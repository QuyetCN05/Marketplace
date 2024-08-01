import { User, UserAuth } from "types/user"
import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface UserState {
  auth: UserAuth
  user: User
  setAuth: (auth: UserAuth) => void
  setUser(user: Partial<User>): void
  clear(): void
}

const defaultUserState: { auth: UserAuth; user: User } = {
  auth: { accessToken: "" },
  user: {
    id: NaN,
    email: "",
    profile: {
      id: NaN,
      avatarUrl: "",
      bannerUrl: "",
      username: "",
      bio: "",
      userId: NaN,
    },
    walletBalance: NaN,
    cart: {
      id: NaN,
      products: [],
      totalPrice: NaN,
      userId: NaN,
      totalProducts: NaN,
    },
  },
}

export const useUser = create<UserState>()(
  persist(
    (set, state) => ({
      ...defaultUserState,
      setAuth: (auth) => set({ auth }),
      setUser: (user) => set({ user: { ...state().user, ...user } }),
      clear: () => set({ ...defaultUserState }),
    }),
    {
      name: "user", // name of the item in the storage (must be unique)
      partialize: (state) =>
        Object.fromEntries(
          Object.entries(state).filter(([key]) => ["auth"].includes(key)),
        ),
    },
  ),
)
