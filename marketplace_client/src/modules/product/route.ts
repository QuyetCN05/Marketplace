import { navPaths } from "constants/nav"
import { lazy } from "react"
import { RouteObject } from "react-router-dom"

export interface ProductParams {
  productId: string
}

const Product = lazy(() => import("modules/product/page/Product"))

export const productRoute: RouteObject = {
  path: navPaths.product,
  children: [
    {
      path: ":productId",
      Component: Product,
    },
  ],
}
