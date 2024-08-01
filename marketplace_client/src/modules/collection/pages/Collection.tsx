import { Icon } from "@iconify-icon/react/dist/iconify.mjs"
import {
  Accordion,
  AccordionItem,
  Avatar,
  Button,
  Card,
  CardBody,
  CardFooter,
  Divider,
  Image,
  Input,
  Modal,
  ModalContent,
  Radio,
  RadioGroup,
  Select,
  SelectItem,
  Skeleton,
  useDisclosure,
} from "@nextui-org/react"
import clsx from "clsx"
import DialogModal from "components/common/DialogModal"
import LoadingIcon from "components/common/LoadingIcon"
import { queryClient } from "configs/queryClient"
import debounce from "lodash.debounce"
import LoginModal from "modules/auth/components/LoginModal"
import { useAddProductToCart } from "modules/cart/services/addProductToCart"
import {
  CartItem,
  CreateOrderRequest,
  useCreateOrder,
} from "modules/cart/services/createOrder"
import { useRemoveProductFromCart } from "modules/cart/services/removeProductFromCart"
import LoadingCollectionList from "modules/home/components/LoadingCollectionList"
import { useGetProductList } from "modules/product/services/getProductList"
import WalletModal from "modules/user/components/WalletModal"
import { useEffect, useMemo, useRef, useState } from "react"
import { useInView } from "react-intersection-observer"
import { Navigate, useNavigate, useParams } from "react-router-dom"
import { toast } from "sonner"
import { useCart } from "store/cart"
import { useUser } from "store/user"
import { CollectionParams } from "../route"
import { useGetCollection } from "../services/getCollection"

export const sortOptions: { key: "asc" | "desc"; label: string }[] = [
  { key: "asc", label: "Price Low To High" },
  { key: "desc", label: "Price High To Low" },
]

export default function Collection() {
  const { user, setUser } = useUser()

  const { cart } = useCart()

  const { collectionId } = useParams<keyof CollectionParams>()

  if (!collectionId || !Number(collectionId)) {
    return <Navigate to="/" />
  }

  const navigate = useNavigate()
  const { ref, inView } = useInView()

  const disclosureLogin = useDisclosure()
  const disclosureDialogPaymentConfirm = useDisclosure()
  const disclosureDialogNotification = useDisclosure()
  const disclosureWallet = useDisclosure()

  const [searchCharacters, setSearchCharacters] = useState<string>()
  const [isFilterOwner, setIsFilterOwner] = useState<boolean>(false)
  const [sortedBy, setSortedBy] = useState<"asc" | "desc">()
  const [minPrice, setMinPrice] = useState<number>()
  const [maxPrice, setMaxPrice] = useState<number>()
  const [filterByPrice, setFilterByPrice] = useState<{
    minPrice?: number
    maxPrice?: number
  }>()

  const [order, setOrder] = useState<{ cart_items: CartItem[] }>()

  const getCollection = useGetCollection(
    Number(collectionId),
    !!Number(collectionId),
  )

  const getProductList = useGetProductList(
    {
      collectionId: Number(collectionId),
      keyword: searchCharacters,
      userId: isFilterOwner ? user.id : undefined,
      sortedBy: sortedBy,
      maxPrice: filterByPrice?.maxPrice,
      minPrice: filterByPrice?.minPrice,
    },
    !!Number(collectionId),
  )

  const debouncedSearch = useRef(
    debounce((value: string) => {
      setSearchCharacters(value)
    }, 500),
  ).current

  const addProductToCart = useAddProductToCart()
  const removeProductFromCart = useRemoveProductFromCart()
  const createOrder = useCreateOrder()

  const handleAddProductToCart = (cartId: number, productId: number) => {
    addProductToCart.mutate(
      {
        cartId,
        productId,
      },
      {
        onSuccess: () => {
          queryClient
            .refetchQueries({
              queryKey: ["getProductListFromCart"],
            })
            .then(() => {
              toast.success("Product added successfully!")
            })
        },
      },
    )
  }
  const handleRemoveProductFromCart = (productId: number) => {
    removeProductFromCart.mutate(
      {
        productId,
      },
      {
        onSuccess: () => {
          queryClient
            .refetchQueries({
              queryKey: ["getProductListFromCart"],
            })
            .then(() => {
              toast.success("Delete product from cart successfully")
            })
        },
      },
    )
  }

  const isRemoveProductFromCart = useMemo(
    () => (productId: number) => {
      if (cart.cartProducts.length > 0) {
        return cart.cartProducts.some((productCart) => {
          return productCart.productId === productId
        })
      }
      return false
    },
    [cart],
  )

  const handleCreateOrder = (order: CreateOrderRequest) => {
    createOrder.mutate(order, {
      onSuccess: async (data) => {
        setUser({ ...user, walletBalance: data.walletBalance })
        await queryClient.refetchQueries({
          queryKey: ["getProduct"],
        })
        disclosureDialogPaymentConfirm.onClose()
        toast.success("Payment successfully")
      },
    })
  }

  useEffect(() => {
    debouncedSearch.cancel()
  }, [debouncedSearch])

  useEffect(() => {
    if (inView) {
      getProductList.fetchNextPage()
    }
  }, [getProductList.fetchNextPage, inView])

  return (
    <>
      <div className="flex justify-center">
        <div className="flex w-full max-w-default flex-col gap-5">
          <div className="relative max-h-[600px]">
            {getCollection.isLoading ? (
              <Skeleton className="h-full rounded-lg">
                <div className="h-[600px] rounded-lg bg-default-300"></div>
              </Skeleton>
            ) : (
              <Image
                radius="none"
                alt="NextUI Fruit Image with Zoom"
                src={getCollection.data?.bannerUrl}
                className="object-fit h-full w-full"
                classNames={{
                  wrapper: clsx(
                    "h-full w-full !max-w-full ",
                    "before:absolute before:w-full before:h-full before:bg-[#00000033] before:z-20",
                  ),
                }}
              />
            )}
            <div className="absolute bottom-5 z-20 flex w-full items-end justify-between gap-10 px-16 text-white">
              <div className="flex w-full flex-1 flex-col gap-5">
                {getCollection.isLoading ? (
                  <Skeleton className="h-14 w-14 rounded-lg border-2 border-default">
                    <div className="h-[600px] rounded-lg bg-default-300"></div>
                  </Skeleton>
                ) : (
                  <Avatar
                    isBordered
                    size="lg"
                    radius="lg"
                    src={getCollection.data?.imageUrl}
                  />
                )}
                {getCollection.isLoading ? (
                  <div className="flex w-full flex-col gap-2">
                    <Skeleton className="w-3/5 rounded-lg border-2 border-default">
                      <div className="h-5 w-3/5 rounded-lg bg-default-200"></div>
                    </Skeleton>
                    <Skeleton className="w-2/5 rounded-lg border-2 border-default">
                      <div className="h-5 w-2/5 rounded-lg bg-default-200"></div>
                    </Skeleton>
                  </div>
                ) : (
                  <div className="flex flex-col">
                    <div className="text-2xl font-semibold capitalize">{`${getCollection.data?.name} by ${getCollection.data?.profile.username}`}</div>
                    <div className="flex items-center">
                      <div>{`Items ${getCollection.data?.totalProducts}`}</div>
                      <Icon icon="mdi:dot" className="text-4xl" />
                      <div>
                        <span>Created </span>
                        <b>
                          {new Date(
                            getCollection.data?.createdAt || "",
                          ).toLocaleDateString("en-US", {
                            month: "short", // "short" cho tên tháng viết tắt, ví dụ: "Jul"
                            year: "numeric", // "numeric" cho năm đầy đủ, ví dụ: "2023"
                          })}
                        </b>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              {getCollection.isLoading ? (
                <div className="flex w-[30%] gap-10">
                  <div className="flex w-full flex-col gap-2">
                    <Skeleton className="w-3/5 rounded-lg border-2 border-default">
                      <div className="h-5 w-3/5 rounded-lg bg-default-200"></div>
                    </Skeleton>
                    <Skeleton className="w-full rounded-lg border-2 border-default">
                      <div className="h-5 w-full rounded-lg bg-default-200"></div>
                    </Skeleton>
                  </div>
                  <div className="flex w-full flex-col gap-2">
                    <Skeleton className="w-4/5 rounded-lg border-2 border-default">
                      <div className="h-5 w-4/5 rounded-lg bg-default-200"></div>
                    </Skeleton>
                    <Skeleton className="w-3/5 rounded-lg border-2 border-default">
                      <div className="h-5 w-3/5 rounded-lg bg-default-200"></div>
                    </Skeleton>
                  </div>
                </div>
              ) : (
                <div className="flex gap-10">
                  <div>
                    <div className="text-xl font-semibold">
                      {getCollection.data?.totalVolume.toLocaleString("de-DE")}{" "}
                      USD
                    </div>
                    <div>Total volume</div>
                  </div>
                  <div>
                    <div className="text-xl font-semibold">
                      {getCollection.data?.floorPrice.toLocaleString("de-DE")}{" "}
                      USD
                    </div>
                    <div>Floor price</div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col pb-20">
            <Accordion variant="splitted" className="px-default">
              <AccordionItem aria-label="Description" title="Description">
                {getCollection.isLoading ? (
                  <Skeleton className="w-full rounded-lg">
                    <div className="h-3 w-full rounded-lg bg-default-200"></div>
                  </Skeleton>
                ) : (
                  getCollection.data?.description
                )}
              </AccordionItem>
            </Accordion>
            <div className="relative flex w-full flex-col gap-5 pt-5">
              <div className="px-default">
                <Divider />
              </div>
              <div className="sticky top-16 z-20 flex w-full items-center gap-5 bg-background/70 px-default py-3 pt-5 backdrop-blur-xl">
                {getCollection.isLoading ? (
                  <Skeleton className="w-full max-w-20 rounded-lg">
                    <div className="h-5 w-full rounded-lg bg-default-200"></div>
                  </Skeleton>
                ) : (
                  <div>{getCollection.data?.totalProducts} results</div>
                )}
                <div className="flex h-full w-full flex-1 gap-5">
                  <Input
                    size="lg"
                    variant="bordered"
                    color="secondary"
                    placeholder="Type to search..."
                    startContent={<Icon icon="icon-park-outline:search" />}
                    endContent={
                      getProductList.isFetching &&
                      !getProductList.isFetchingNextPage && (
                        <div className="flex items-center">
                          <LoadingIcon size="sm" />
                        </div>
                      )
                    }
                    className="h-full flex-1"
                    classNames={{
                      inputWrapper: "h-full",
                    }}
                    onValueChange={debouncedSearch}
                  />

                  <Select
                    variant="bordered"
                    label="Sort"
                    className="max-w-[200px]"
                    onChange={(e) => {
                      setSortedBy(e.target.value as "asc" | "desc")
                    }}
                  >
                    {sortOptions.map((option) => (
                      <SelectItem key={option.key}>{option.label}</SelectItem>
                    ))}
                  </Select>
                </div>
              </div>
              <div className="flex justify-between gap-10 px-default">
                <div className="relative h-full w-full max-w-80">
                  <Accordion
                    className="sticky top-40"
                    selectionMode="multiple"
                    showDivider={!!user.email}
                    defaultExpandedKeys={["owner", "price"]}
                  >
                    {user.email ? (
                      <AccordionItem
                        key="owner"
                        classNames={{
                          heading: "font-semibold",
                        }}
                        aria-label="Owner"
                        title="Owner"
                        className="pb-2"
                      >
                        <RadioGroup
                          color="secondary"
                          size="lg"
                          classNames={{
                            wrapper: "gap-5",
                          }}
                          onValueChange={(value) => {
                            setIsFilterOwner(value === "owner")
                          }}
                          defaultValue="all"
                        >
                          <Radio value="all" className="max-w-full">
                            All
                          </Radio>
                          <Radio value="owner" className="max-w-full">
                            Me
                          </Radio>
                        </RadioGroup>
                      </AccordionItem>
                    ) : (
                      <AccordionItem as="noscript"></AccordionItem>
                    )}
                    <AccordionItem
                      key="price"
                      aria-label="Price"
                      title="Price"
                      classNames={{
                        heading: "font-semibold",
                      }}
                    >
                      <div className="flex flex-col gap-2">
                        <Select
                          variant="bordered"
                          label="Select an Currencies"
                          defaultSelectedKeys={["USD"]}
                        >
                          <SelectItem key="USD">USD</SelectItem>
                        </Select>
                        <div className="flex items-center">
                          <Input
                            color="secondary"
                            type="number"
                            variant="bordered"
                            size="lg"
                            onValueChange={(value) => {
                              setMinPrice(Number(value) || undefined)
                            }}
                          />
                          <b className="px-5">to</b>
                          <Input
                            color="secondary"
                            type="number"
                            variant="bordered"
                            size="lg"
                            onValueChange={(value) => {
                              setMaxPrice(Number(value) || undefined)
                            }}
                          />
                        </div>
                        <Button
                          color="secondary"
                          onClick={() => {
                            setFilterByPrice({
                              maxPrice,
                              minPrice,
                            })
                          }}
                        >
                          Apply
                        </Button>
                      </div>
                    </AccordionItem>
                  </Accordion>
                </div>

                {getProductList.isLoading ? (
                  <div className="flex-1">
                    <LoadingCollectionList
                      quality={15}
                      wrapperClass="grid-cols-5"
                    />
                  </div>
                ) : (
                  <div className="flex flex-1 flex-col gap-5">
                    {getProductList.data &&
                      getProductList.data.pages.map((page, idx) => (
                        <div key={idx} className="grid grid-cols-5 gap-5">
                          {page.data?.map((product, index) => (
                            <Card
                              as="div"
                              shadow="sm"
                              key={index}
                              isPressable
                              className="hover:-translate-y-1 hover:shadow-xl [&:hover>div>#buy]:translate-y-0"
                              onClick={() => navigate(`/product/${product.id}`)}
                            >
                              <CardBody className="overflow-visible p-0">
                                <Image
                                  shadow="sm"
                                  radius="lg"
                                  width="100%"
                                  alt={product.name}
                                  className="h-48 w-full object-cover"
                                  src={product.imageUrl}
                                />
                              </CardBody>
                              <CardFooter className="flex flex-col items-start px-0 pb-0 pt-3">
                                <div className="line-clamp-1 px-3 text-start font-semibold capitalize">
                                  {product.name}
                                </div>
                                <div className="flex w-full items-start gap-2 px-3">
                                  <div className="text-default-500">Price:</div>
                                  <div className="font-semibold">{`${product.price.toLocaleString("de-DE")} USD`}</div>
                                </div>
                                <div
                                  id="buy"
                                  className="flex w-full translate-y-full pt-2 transition-all"
                                >
                                  <Button
                                    color="secondary"
                                    radius="none"
                                    className="flex-1 border-r-1"
                                    onClick={() => {
                                      if (!user.email) {
                                        return disclosureLogin.onOpen()
                                      }

                                      setOrder({
                                        cart_items: [
                                          {
                                            product_id: product.id,
                                            quantity: 1,
                                            price: product.price,
                                          },
                                        ],
                                      })

                                      disclosureDialogPaymentConfirm.onOpen()
                                    }}
                                  >
                                    Buy now
                                  </Button>
                                  <Button
                                    color="secondary"
                                    isIconOnly
                                    radius="none"
                                    className="px-2"
                                    children={
                                      isRemoveProductFromCart(product.id) ? (
                                        <Icon
                                          icon="mdi:cart-off"
                                          className="text-2xl"
                                        />
                                      ) : (
                                        <Icon
                                          icon="mdi:cart-outline"
                                          className="text-2xl"
                                        />
                                      )
                                    }
                                    onClick={() => {
                                      if (!user.email) {
                                        return disclosureLogin.onOpen()
                                      }
                                      isRemoveProductFromCart(product.id)
                                        ? handleRemoveProductFromCart(
                                            product.id,
                                          )
                                        : handleAddProductToCart(
                                            user.cart.id,
                                            product.id,
                                          )
                                    }}
                                  />
                                </div>
                              </CardFooter>
                            </Card>
                          ))}
                        </div>
                      ))}

                    {getProductList.isFetchingNextPage && (
                      <LoadingCollectionList
                        quality={10}
                        wrapperClass="grid-cols-5"
                      />
                    )}

                    {getProductList.hasNextPage && <div ref={ref}></div>}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal
        size="lg"
        isDismissable={false}
        isOpen={disclosureLogin.isOpen}
        onClose={disclosureLogin.onClose}
        className="py-8"
        classNames={{
          closeButton: "top-4 right-4 text-xl",
        }}
      >
        <ModalContent>
          {(onClose) => <LoginModal onClose={onClose} />}
        </ModalContent>
      </Modal>
      <Modal
        size="lg"
        isDismissable={false}
        isOpen={disclosureDialogPaymentConfirm.isOpen}
        onClose={disclosureDialogPaymentConfirm.onClose}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <DialogModal
                textHeader="Confirm Payment"
                body={
                  <span>
                    Are you sure you want to <strong>buy</strong> this product?
                  </span>
                }
                btnAcceptProps={{
                  color: "secondary",
                  children: "Confirm",
                  isLoading: createOrder.isPending,
                  onClick: () => {
                    if (order) {
                      if (user.walletBalance < order.cart_items[0].price) {
                        disclosureDialogNotification.onOpen()
                        return
                      }
                      handleCreateOrder(order)
                    }
                  },
                }}
                onClose={onClose}
              />
            </>
          )}
        </ModalContent>
      </Modal>
      <Modal
        size="lg"
        isDismissable={false}
        isOpen={disclosureDialogNotification.isOpen}
        onClose={disclosureDialogNotification.onClose}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <DialogModal
                textHeader="Notification"
                body={
                  <span>
                    You don't have enough money to purchase this product. Would
                    you like to add more funds?
                  </span>
                }
                btnAcceptProps={{
                  color: "secondary",
                  children: "Confirm",
                  isLoading: createOrder.isPending,
                  onClick: () => {
                    disclosureWallet.onOpen()
                    disclosureDialogNotification.onClose()
                  },
                }}
                onClose={onClose}
              />
            </>
          )}
        </ModalContent>
      </Modal>
      <Modal
        size="lg"
        isOpen={disclosureWallet.isOpen}
        onClose={disclosureWallet.onClose}
        className="p-4"
      >
        <ModalContent>
          <WalletModal />
        </ModalContent>
      </Modal>
    </>
  )
}
