import PageLoading from "components/common/PageLoading"
import { useGetUserProfile } from "modules/user/services/getUserProfile"
import { PropsWithChildren, useEffect, useState } from "react"
import { useUser } from "store/user"

export default function AuthLayout({ children }: PropsWithChildren) {
  const [loading, setLoading] = useState<boolean>(true)

  const { auth, setUser } = useUser()

  const getUserProfile = useGetUserProfile(!!auth.accessToken)

  useEffect(() => {
    if (getUserProfile.data) {
      setUser(getUserProfile.data)
    }
  }, [getUserProfile.data, setUser])

  useEffect(() => {
    if (
      getUserProfile.isSuccess ||
      getUserProfile.isError ||
      !auth.accessToken
    ) {
      setLoading(false)
    }
  }, [getUserProfile.isSuccess, getUserProfile.isError, auth.accessToken])

  if (!loading) {
    return children
  }

  return <PageLoading />
}
