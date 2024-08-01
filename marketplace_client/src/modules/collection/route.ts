import { navPaths } from "constants/nav"
import { lazy } from "react"
import { RouteObject } from "react-router-dom"

export interface CollectionParams {
  collectionId: string
}

const Collection = lazy(() => import("modules/collection/pages/Collection"))

export const collectionRoute: RouteObject = {
  path: navPaths.collection,
  children: [
    {
      path: ":collectionId",
      Component: Collection,
    },
  ],
}
