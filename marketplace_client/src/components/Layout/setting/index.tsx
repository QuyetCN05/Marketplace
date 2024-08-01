import { Outlet } from "react-router-dom"
import Sidebar from "./Sidebar"

export default function SettingLayout() {
  return (
    <div className="flex flex-1 justify-center">
      <div className="flex w-full max-w-default px-16">
        <Sidebar />
        <Outlet />
      </div>
    </div>
  )
}
