import { yupResolver } from "@hookform/resolvers/yup"
import { Button, SelectItem } from "@nextui-org/react"
import { useState } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { toast } from "sonner"
import { useUser } from "store/user.ts"
import * as yup from "yup"
import Field from "../../../components/core/field"
import { Category } from "../../../types/category.ts"
import useGetCategories from "../../categories/services/getCategories.ts"
import {
  createCollection,
  createCollectionDTO,
} from "../services/createCollection.ts"

const formSchema = yup.object({
  name: yup.string().required().min(3),
  floor_price: yup.number().required().min(1),
  description: yup.string().required().min(3),
  total_volume: yup.number().required().min(1),
  category_id: yup.number().required(),
})

export default function CreateCollectionsComponent() {
  const { user } = useUser()

  const methods = useForm<createCollectionDTO>({
    resolver: yupResolver(formSchema),
    mode: "onChange",
  })

  const [imageUrl, setImageUrl] = useState<string | null>("")
  const [bannerUrl, setBannerUrl] = useState<string | null>("")
  const [isImageUploaded, setIsImageUploaded] = useState(false)
  const [isBannerUploaded, setIsBannerUploaded] = useState(false)

  const getCategory = useGetCategories()
  const [imageFile, setImage] = useState<File | null>(null)

  const [bannerFile, setBannerFile] = useState<File | null>(null)
  // const { user, clear } = useUser()

  console.log(methods.watch())

  const onSubmit = async (data: createCollectionDTO) => {
    console.log(data)
    const formData = new FormData()
    formData.append("name", data.name || "")
    formData.append("floor_price", data.floor_price.toString())
    formData.append("description", data.description)
    formData.append("total_volume", data.total_volume.toString() || "")
    formData.append("category_id", data.category_id.toString() || "")
    formData.append("created_by_user_id", user.id.toString())
    formData.append("profile_id", user.profile.id.toString())

    if (imageFile) {
      formData.append("images", imageFile)
    }

    if (bannerFile) {
      formData.append("banner", bannerFile)
    }
    await createCollection(formData).then((response) => {
      toast.success(response.messages)
    })
    // toast.success(response.message)
  }
  const handelImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (isImageUploaded) {
      alert("You can only upload one image")
      return
    }
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        setImageUrl(reader.result as string)
        setIsImageUploaded(true)
        setImage(file)
      }

      reader.readAsDataURL(file)
    }
  }
  const handleBannerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (isBannerUploaded) {
      alert("You can only upload one banner")
      return
    }
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        setBannerUrl(reader.result as string)
        setBannerFile(file)
        setIsBannerUploaded(true)
      }

      reader.readAsDataURL(file)
    }
  }
  const handleRemoveImage = () => {
    setImageUrl(null)
    setIsImageUploaded(false)
  }
  const handleRemoveBanner = () => {
    setBannerUrl(null)
    setIsBannerUploaded(false)
  }
  return (
    <>
      <FormProvider {...methods}>
        <form
          className="w-full pt-20"
          onSubmit={methods.handleSubmit(onSubmit)}
        >
          <div className="mx-auto flex w-full items-center justify-center pb-2 pt-6 text-xl">
            {/* Create Collection */}
          </div>
          <div className="flex items-center justify-center">
            <div className="flex max-w-4xl flex-col">
              <div className="flex">
                <div className="pr-4">
                  <div className="ml-12 flex w-full flex-col gap-4">
                    <div className="flex gap-20">
                      <div className="flex flex-col gap-6">
                        <div className="flex flex-col gap-2">
                          <div className="font-semibold">Name</div>
                          <Field
                            t="input"
                            name="name"
                            variant="bordered"
                            size="lg"
                            placeholder="Enter name of collections"
                          />
                        </div>
                        <div className="flex flex-col gap-2">
                          <div className="font-semibold">Description</div>
                          <Field
                            t="text-area"
                            name="description"
                            size="lg"
                            variant="bordered"
                            placeholder="Please fill the description"
                          />
                        </div>
                        <div className="flex flex-col gap-2">
                          <div className="font-semibold">Floor Price</div>
                          <Field
                            t="input"
                            type="number"
                            name="floor_price"
                            size="lg"
                            variant="bordered"
                            placeholder="Enter the floor price"
                          />
                        </div>
                        <div className="flex flex-col gap-2">
                          <div className="font-semibold">Total volume</div>
                          <Field
                            t="input"
                            type="number"
                            name="total_volume"
                            size="lg"
                            variant="bordered"
                            placeholder="Enter the total-volume"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="pl-8">
                  <div className="flex w-full flex-col gap-4">
                    <div className="flex flex-col items-center rounded-lg border p-4">
                      <label className="mb-2 block text-sm font-bold text-gray-700">
                        Image <span className="text-gray-500">(i)</span>
                      </label>
                      <div className="relative flex w-full flex-col items-start justify-center rounded-lg border-2 border-dashed border-gray-400 p-4">
                        <input
                          type="file"
                          accept="image/*"
                          className="absolute h-full w-full cursor-pointer opacity-0"
                          onChange={handelImageChange}
                        />
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            className="image max-w-[100px]"
                            alt="preview"
                          />
                        ) : null}
                        {imageUrl ? (
                          <svg
                            className="absolute right-4 top-1/2 h-8 w-8 -translate-y-1/2 transform"
                            xmlns="http://www.w3.org/2000/svg"
                            width="1em"
                            height="1em"
                            viewBox="0 0 24 24"
                            onClick={handleRemoveImage}
                          >
                            <path
                              fill="currentColor"
                              d="M19 4h-3.5l-1-1h-5l-1 1H5v2h14M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6z"
                            ></path>
                          </svg>
                        ) : null}
                      </div>
                      <p className="mt-2 text-xs text-gray-500">
                        You may change this after deploying your contract.
                      </p>
                    </div>
                    <div className="flex flex-col items-center rounded-lg border p-4">
                      <label className="mb-2 block text-sm font-bold text-gray-700">
                        Banner <span className="text-gray-500">(i)</span>
                      </label>
                      <div className="relative flex w-full flex-col items-start justify-center rounded-lg border-2 border-dashed border-gray-400 p-4">
                        <input
                          type="file"
                          accept="image/*"
                          className="absolute h-full w-full cursor-pointer opacity-0"
                          onChange={handleBannerChange}
                        />
                        {bannerUrl ? (
                          <img
                            src={bannerUrl}
                            className="image max-w-[100px]"
                            alt="preview"
                          />
                        ) : null}
                        {bannerUrl ? (
                          <svg
                            className="absolute right-4 top-1/2 h-8 w-8 -translate-y-1/2 transform"
                            xmlns="http://www.w3.org/2000/svg"
                            width="1em"
                            height="1em"
                            viewBox="0 0 24 24"
                            onClick={handleRemoveBanner}
                          >
                            <path
                              fill="currentColor"
                              d="M19 4h-3.5l-1-1h-5l-1 1H5v2h14M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6z"
                            ></path>
                          </svg>
                        ) : null}
                      </div>

                      <p className="mt-2 text-xs text-gray-500">
                        You may change this after deploying your contract.
                      </p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className="font-semibold">Category</div>

                      <Field
                        t="select"
                        name="category_id"
                        items={getCategory.data || []}
                        label="Category"
                        placeholder="Select an category"
                        className="max-w-xs"
                        options={
                          getCategory.data?.map((category: Category) => ({
                            label: category.name,
                            value: category.id,
                          })) || []
                        }
                      />
                      {getCategory.data?.map((category: Category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex justify-center">
                <Button
                  type="submit"
                  className="w-3/4 rounded bg-blue-500 py-2 font-bold text-white hover:bg-blue-700"
                >
                  Submit
                </Button>
              </div>
            </div>
          </div>
        </form>
      </FormProvider>
    </>
  )
}
