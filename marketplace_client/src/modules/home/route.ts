import { navPaths } from "constants/nav"
import { lazy } from "react"
import { RouteObject } from "react-router-dom"

const HomePage = lazy(() => import("modules/home/pages/HomePage"))

export const homeRoute: RouteObject = {
  path: navPaths.home,
  children: [
    {
      path: "",
      Component: HomePage,
    },
  ],
}
