import { yupResolver } from "@hookform/resolvers/yup"
import { Icon } from "@iconify-icon/react/dist/iconify.mjs"
import { Avatar, Button, Input } from "@nextui-org/react"
import clsx from "clsx"
import Field from "components/core/field"
import {
  UpdateProfileRequest,
  useUpdateProfile,
} from "modules/user/services/updateProfile"
import { useState } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { toast } from "sonner"
import { useUser } from "store/user"
import * as yup from "yup"

const formSchema = yup.object({
  username: yup.string().required().min(3),
  avatarUrl: yup.string().optional(),
  bannerUrl: yup.string().optional(),
  bio: yup.string().optional(),
})

export default function ProfilePage() {
  const { user, setUser } = useUser()

  const [avatarUrl, setAvatarUrl] = useState<string>(user.profile.avatarUrl)
  const [bannerUrl, setBannerUrl] = useState<string>(user.profile.bannerUrl)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [bannerFile, setBannerFile] = useState<File | null>(null)

  const methods = useForm<Omit<UpdateProfileRequest, "userId">>({
    defaultValues: {
      username: user.profile.username,
      avatarUrl: user.profile.avatarUrl,
      bannerUrl: user.profile.bannerUrl || "",
      bio: user.profile.bio || "",
    },
    resolver: yupResolver(formSchema),
    mode: "onChange",
  })

  const handelAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setAvatarUrl(URL.createObjectURL(file))
      setAvatarFile(file)
    }
  }

  const handleBannerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setBannerUrl(URL.createObjectURL(file))
      setBannerFile(file)
    }
  }

  const { mutate, isPending: isPendingUpdate } = useUpdateProfile()

  const onSubmit = async (data: UpdateProfileRequest) => {
    const formData = new FormData()
    formData.append("username", data.username)
    formData.append("bio", data.bio || "")
    if (avatarFile) {
      formData.append("avatar", avatarFile)
    }
    if (bannerFile) {
      formData.append("banner", bannerFile)
    }

    mutate(formData, {
      onSuccess: (data) => {
        console.log(123)
        console.log(data)
        toast.success("Profile updated successfully")
        setUser({ ...user, profile: data })
      },
    })
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <div className="ml-12 flex w-full flex-col gap-4">
          <div className="pb-4 pt-8 text-4xl font-semibold">
            Profile details
          </div>
          <div className="flex gap-20">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <div className="font-semibold">Username</div>
                <Field
                  t="input"
                  name="username"
                  variant="bordered"
                  size="lg"
                  placeholder="Enter username"
                />
              </div>
              <div className="flex flex-col gap-2">
                <div className="font-semibold">Bio</div>
                <Field
                  t="text-area"
                  name="bio"
                  size="lg"
                  variant="bordered"
                  placeholder="Tell the world your story!"
                />
              </div>
              <div className="flex flex-col gap-2">
                <div className="font-semibold">Email Address</div>
                <Input
                  isDisabled
                  variant="bordered"
                  size="lg"
                  placeholder="Enter email"
                  value={user.email}
                />
              </div>
              <div className="flex flex-col gap-2">
                <div className="font-semibold">Social Connections</div>
                <div className="text-default-500">
                  Help collectors verify your account by connecting social
                  accounts
                </div>
                <div className="flex items-center justify-between gap-4 pt-2">
                  <div className="flex items-center gap-4">
                    <Icon
                      icon="mdi:twitter"
                      className="text-3xl text-default-400"
                    />
                    <span className="font-semibold">Twitter</span>
                  </div>
                  <Button size="lg" color="secondary">
                    Connect
                  </Button>
                </div>
                <div className="flex items-center justify-between gap-4 pt-2">
                  <div className="flex items-center gap-4">
                    <Icon
                      icon="mdi:instagram"
                      className="text-3xl text-default-400"
                    />
                    <span className="font-semibold">Instagram</span>
                  </div>
                  <Button size="lg" color="secondary">
                    Connect
                  </Button>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-4">
                <div className="font-semibold">Profile Image</div>
                <div
                  className={clsx(
                    "relative h-40 w-40 overflow-hidden rounded-full",
                    // {
                    //   "border-4 border-dotted border-secondary"
                    //
                    // },
                  )}
                >
                  <Avatar
                    src={avatarUrl}
                    className="h-full w-full cursor-pointer"
                  />

                  <div className="absolute top-0 flex h-full w-full cursor-pointer items-center justify-center bg-[#1212120a] opacity-0 transition duration-150 hover:opacity-100">
                    <input
                      type="file"
                      accept="image/*"
                      className="absolute h-full w-full cursor-pointer opacity-0"
                      onChange={handelAvatarChange}
                    />
                    <Icon icon="tdesign:edit" className="text-3xl text-white" />
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <div className="font-semibold">Profile Banner</div>
                <div
                  className={clsx(
                    "relative h-40 w-40 overflow-hidden rounded-2xl",
                  )}
                >
                  <>
                    <Avatar
                      radius="md"
                      src={bannerUrl}
                      className="h-full w-full cursor-pointer"
                    />
                    <div className="absolute top-0 flex h-full w-full cursor-pointer items-center justify-center bg-[#1212120a] opacity-0 transition duration-150 hover:opacity-100">
                      <input
                        type="file"
                        accept="image/*"
                        className="absolute h-full w-full cursor-pointer opacity-0"
                        onChange={handleBannerChange}
                      />
                      <Icon
                        icon="tdesign:edit"
                        className="text-3xl text-white"
                      />
                    </div>
                  </>
                </div>
              </div>
            </div>
          </div>
          <div>
            <Button
              type="submit"
              size="lg"
              color="secondary"
              isLoading={isPendingUpdate}
            >
              Save
            </Button>
          </div>
        </div>
      </form>
    </FormProvider>
  )
}
