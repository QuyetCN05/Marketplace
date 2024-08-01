import { yupResolver } from "@hookform/resolvers/yup"
import { Button, SelectItem } from "@nextui-org/react"
import useGetCollectionCreated from "modules/collections/services/GetCollectionIsCreated.ts"
import { useState } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { CiSquarePlus } from "react-icons/ci"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { useUser } from "store/user.ts"
import * as yup from "yup"
import Field from "../../../components/core/field"
import { createProduct, createProductDTO } from "../services/createProduct.ts"

const formSchema = yup.object({
  name: yup.string().required().min(3),
  price: yup.number().required().min(1),
  description: yup.string().required().min(3),
  quantity: yup.number().required().min(1),
  collection_id: yup.number().required(),
})

export default function CreateProductComponent() {
  const methods = useForm<createProductDTO>({
    resolver: yupResolver(formSchema),
    mode: "onChange",
  })

  const { user } = useUser()

  const [imageUrl, setImageUrl] = useState<string | null>("")

  const [isImageUploaded, setIsImageUploaded] = useState(false)

  const listCollectionCreated = useGetCollectionCreated(user.id.toString())
  const collectionsCreated = listCollectionCreated.data?.collections

  const [imageFile, setImage] = useState<File | null>(null)
  const navigate = useNavigate()

  console.log(methods.watch())

  const onSubmit = async (data: createProductDTO) => {
    console.log(data)
    const formData = new FormData()
    formData.append("name", data.name || "")
    formData.append("price", data.price.toString())
    formData.append("description", data.description)
    formData.append("quantity", data.quantity.toString() || "")
    formData.append("collection_id", data.collection_id.toString() || "")

    if (imageFile) {
      formData.append("image", imageFile)
    }
    console.log(formData)

    await createProduct(formData).then((res) => {
      console.log(res)
      toast.success("Product created successfully")
    })
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
  const handleRemoveImage = () => {
    setImageUrl(null)
    setIsImageUploaded(false)
  }
  const handleClickNavigate = () => {
    navigate("/settings/create-collections")
  }
  return (
    <>
      <FormProvider {...methods}>
        <form
          className="w-full pt-20"
          onSubmit={methods.handleSubmit(onSubmit)}
        >
          <div className="mx-auto flex w-full items-center justify-center pb-2 pt-6 text-xl">
            {/* Create Product */}
          </div>
          <div className="flex items-center justify-center">
            <div className="mx-auto flex max-w-4xl flex-col">
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
                          <div className="font-semibold">Price</div>
                          <Field
                            t="input"
                            type="number"
                            name="price"
                            size="lg"
                            variant="bordered"
                            placeholder="Enter the  price"
                          />
                        </div>
                        <div className="flex flex-col gap-2">
                          <div className="font-semibold">Quantity</div>
                          <Field
                            t="input"
                            type="number"
                            name="quantity"
                            size="lg"
                            variant="bordered"
                            placeholder="Enter the quantity"
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
                    <div className="flex flex-col gap-2">
                      <div className="font-semibold">Collection</div>
                      <div className="flex items-center space-x-2">
                        <button
                          className="mt-6 flex h-10 items-center justify-center border border-gray-300 p-4"
                          onClick={handleClickNavigate}
                        >
                          <CiSquarePlus />
                        </button>

                        <Field
                          t="select"
                          name="collection_id"
                          items={collectionsCreated || []}
                          label="Collection"
                          placeholder="Select a Collection"
                          className="h-10 max-w-xs"
                          options={
                            collectionsCreated?.map((collection) => ({
                              label: collection.name,
                              value: collection.id,
                            })) || []
                          }
                        />
                        {collectionsCreated?.map((collection) => (
                          <SelectItem key={collection.id} value={collection.id}>
                            {collection.name}
                          </SelectItem>
                        ))}
                      </div>
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
