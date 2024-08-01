import { PropsWithChildren } from "react"
import { Navigate } from "react-router-dom"
import { useUser } from "store/user"
import Header from "./home/Header"

export default function HeaderLayout({ children }: PropsWithChildren) {
  const { user } = useUser()

  if (!user.email) {
    return <Navigate to="/" />
  }
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      {children}
    </div>
  )
}
