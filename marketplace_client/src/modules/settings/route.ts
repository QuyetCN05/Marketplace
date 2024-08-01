import CreateCollectionsComponent from "modules/collections/components/CreateCollections"
import { RouteObject } from "react-router-dom"
import ProfilePage from "./pages/ProfilePage"
import CreateProductComponent from "modules/products/components/CreateProduct"
import AdminDashboard from "modules/user/components/DashBoardComponent"

export const settingsRoute: RouteObject = {
  path: "",
  children: [
    {
      path: "profile",
      Component: ProfilePage,
    },
    {
      path: "create-collections",
      Component: CreateCollectionsComponent,
    },
    {
      path: "create-products",
      Component: CreateProductComponent,
    },
    {
      path: "management",
      Component: AdminDashboard,
    },
  ],
}
