import { Spinner } from "@nextui-org/react"

export default function PageLoading() {
  return (
    <div className="h-screen flex justify-center items-center">
      <Spinner color="primary" size="lg" />
    </div>
  )
}
