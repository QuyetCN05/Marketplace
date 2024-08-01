import { CartProducts } from "types/cartProducts"
import { create } from "zustand"

interface Cart {
  cartProducts: CartProducts[]
}

export interface CartState {
  cart: Cart

  setCart(cart: Cart): void
  clear(): void
}

const defaultCartState: { cart: Cart } = {
  cart: {
    cartProducts: [],
  },
}

export const useCart = create<CartState>()((set, state) => ({
  ...defaultCartState,
  setCart: (cart) => set({ cart: { ...state().cart, ...cart } }),
  clear: () => set({ ...defaultCartState }),
}))
