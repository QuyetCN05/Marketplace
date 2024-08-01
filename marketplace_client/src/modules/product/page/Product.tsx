import { Icon } from "@iconify-icon/react/dist/iconify.mjs"
import {
  Accordion,
  AccordionItem,
  Avatar,
  Button,
  Card,
  CardBody,
  CardFooter,
  Image,
  Input,
  Modal,
  ModalContent,
  Skeleton,
  useDisclosure,
} from "@nextui-org/react"
import DialogModal from "components/common/DialogModal"
import { queryClient } from "configs/queryClient"
import LoginModal from "modules/auth/components/LoginModal"
import { useAddProductToCart } from "modules/cart/services/addProductToCart"
import {
  CartItem,
  CreateOrderRequest,
  useCreateOrder,
} from "modules/cart/services/createOrder"
import { useRemoveProductFromCart } from "modules/cart/services/removeProductFromCart"
import LoadingCollectionList from "modules/home/components/LoadingCollectionList"
import WalletModal from "modules/user/components/WalletModal"
import { useEffect, useMemo, useRef, useState } from "react"
import { Link, Navigate, useNavigate, useParams } from "react-router-dom"
import { toast } from "sonner"
import { useCart } from "store/cart"
import { useUser } from "store/user"
import { Swiper, SwiperRef, SwiperSlide } from "swiper/react"
import { ProductParams } from "../route"
import { useGetProduct } from "../services/getProduct"

export default function Product() {
  const { user, setUser } = useUser()

  const { cart } = useCart()

  const { productId } = useParams<keyof ProductParams>()

  if (!productId || !Number(productId)) {
    return <Navigate to="/" />
  }
  const [quantity, setQuantity] = useState<number>(1)
  const [order, setOrder] = useState<{ cart_items: CartItem[] }>()

  const disclosureLogin = useDisclosure()
  const disclosureDialogPaymentConfirm = useDisclosure()
  const disclosureDialogNotification = useDisclosure()
  const disclosureWallet = useDisclosure()

  const addProductToCart = useAddProductToCart()
  const removeProductFromCart = useRemoveProductFromCart()

  const swiperRefProducts = useRef<SwiperRef>(null)
  const nextButtonRefProducts = useRef(null)
  const prevButtonRefProducts = useRef(null)

  const navigate = useNavigate()

  const getProduct = useGetProduct(Number(productId))
  const createOrder = useCreateOrder()

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

  const handleAddProductToCart = (
    cartId: number,
    productId: number,
    quantity?: number,
  ) => {
    addProductToCart.mutate(
      {
        cartId,
        productId,
        quantity: quantity || 1,
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
    setQuantity(1)
  }, [productId])

  return (
    <>
      <div className="flex justify-center pt-24">
        <div className="flex w-full max-w-default flex-col gap-5 px-default">
          {getProduct.isLoading ? (
            <div className="flex w-full gap-10">
              <div className="flex h-full w-full max-w-3xl flex-col gap-5">
                <Skeleton className="h-[70vw] max-h-[768px] w-full max-w-3xl rounded-lg border-2 border-default">
                  <div className="h-[70vw] max-h-[768px] w-full max-w-3xl rounded-lg bg-default-300"></div>
                </Skeleton>
                <Skeleton className="w-full rounded-lg border-2 border-default">
                  <div className="h-10 w-full rounded-lg bg-default-200"></div>
                </Skeleton>
              </div>
              <div className="relative w-full">
                <div className="sticky top-20 flex w-full max-w-3xl flex-col gap-5 rounded-2xl pt-2">
                  <Skeleton className="w-full rounded-lg border-2 border-default">
                    <div className="h-5 w-full rounded-lg bg-default-200"></div>
                  </Skeleton>
                  <Skeleton className="w-3/5 rounded-lg border-2 border-default">
                    <div className="h-5 w-3/5 rounded-lg bg-default-200"></div>
                  </Skeleton>
                  <Skeleton className="w-4/5 rounded-lg border-2 border-default">
                    <div className="h-5 w-3/5 rounded-lg bg-default-200"></div>
                  </Skeleton>
                  <Skeleton className="w-full rounded-lg border-2 border-default">
                    <div className="h-20 w-full rounded-lg bg-default-200"></div>
                  </Skeleton>
                </div>
              </div>
            </div>
          ) : (
            getProduct.data && (
              <div className="flex w-full gap-10">
                <div className="flex h-full w-full max-w-3xl flex-col gap-5">
                  <Avatar
                    isBordered
                    radius="lg"
                    src={getProduct.data?.imageUrl}
                    className="h-[70vw] max-h-[768px] w-full max-w-3xl"
                  />
                  <Accordion
                    defaultExpandedKeys={["description"]}
                    variant="splitted"
                    className="px-0"
                  >
                    <AccordionItem key="description" title="Description">
                      <div>
                        By{" "}
                        <b className="capitalize">
                          {getProduct.data?.collection.profile.username}
                        </b>
                      </div>
                      {getProduct.data?.description}
                    </AccordionItem>
                  </Accordion>
                </div>
                <div className="relative w-full">
                  <div className="sticky top-20 flex w-full max-w-3xl flex-col gap-5 rounded-2xl pt-2">
                    <Link
                      to={`/collection/${getProduct.data?.collectionId}`}
                      className="w-fit capitalize text-secondary-700"
                    >
                      {getProduct.data?.collection.name} by{" "}
                      {getProduct.data?.collection.profile.username}
                    </Link>
                    <div className="flex flex-col gap-1">
                      <div className="text-3xl font-semibold capitalize">
                        {getProduct.data?.name}
                      </div>
                    </div>
                    <div className="flex gap-5">
                      <div className="flex items-center gap-2">
                        <Icon icon="cil:view-module" className="text-2xl" />
                        <div>{getProduct.data?.quantity} items</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Icon
                          icon="material-symbols:category-outline"
                          className="text-2xl"
                        />
                        <div>{getProduct.data?.collection.category.name}</div>
                      </div>
                    </div>
                    <div className="flex w-full flex-col items-center justify-center gap-5 rounded-2xl border-1 p-5">
                      <div className="flex w-full items-center justify-between gap-5">
                        <div className="w-full">
                          <span className="text-default-600">Price</span>
                          <div className="text-3xl font-semibold">
                            {(
                              (getProduct.data?.price || 0) * quantity
                            ).toLocaleString("de-DE")}{" "}
                            USD
                          </div>
                        </div>
                        <div className="flex">
                          <Input
                            size="lg"
                            type="number"
                            variant="bordered"
                            value={quantity.toString()}
                            onChange={(e) => {
                              if (Number(e.target.value) < 1) {
                                return setQuantity(1)
                              }
                              setQuantity(Number(e.target.value))
                            }}
                            isInvalid={quantity > getProduct.data.quantity}
                            errorMessage="Quantity exceeds stock"
                            startContent={
                              <button className="flex items-center">
                                <Icon
                                  icon="ic:round-minus"
                                  className="cursor-pointer text-xl"
                                  onClick={() =>
                                    setQuantity((prevs) =>
                                      prevs - 1 > 0 ? prevs - 1 : 1,
                                    )
                                  }
                                />
                              </button>
                            }
                            endContent={
                              <button className="flex items-center">
                                <Icon
                                  icon="ic:round-plus"
                                  className="cursor-pointer text-xl"
                                  onClick={() =>
                                    setQuantity((prevs) => prevs + 1)
                                  }
                                />
                              </button>
                            }
                            className="max-w-52"
                            classNames={{
                              input: "text-center",
                            }}
                          />
                        </div>
                      </div>
                      <div className="flex w-full overflow-hidden">
                        <Button
                          size="lg"
                          color="secondary"
                          radius="none"
                          className="w-full rounded-l-xl border-r-1 font-semibold"
                          onClick={() => {
                            if (!user.email) {
                              return disclosureLogin.onOpen()
                            }

                            setOrder({
                              cart_items: [
                                {
                                  product_id: getProduct.data.id,
                                  quantity: quantity,
                                  price: getProduct.data.price * quantity,
                                },
                              ],
                            })

                            disclosureDialogPaymentConfirm.onOpen()
                          }}
                          isDisabled={quantity > getProduct.data.quantity}
                        >
                          Buy now
                        </Button>
                        <Button
                          size="lg"
                          color="secondary"
                          radius="none"
                          className="rounded-r-xl"
                          children={
                            isRemoveProductFromCart(getProduct.data.id) ? (
                              <Icon icon="mdi:cart-off" className="text-2xl" />
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
                            isRemoveProductFromCart(getProduct.data.id)
                              ? handleRemoveProductFromCart(getProduct.data.id)
                              : handleAddProductToCart(
                                  user.cart.id,
                                  getProduct.data.id,
                                  quantity,
                                )
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          )}
          <div className="flex flex-col pt-5">
            <div className="flex items-center gap-5 text-2xl font-semibold">
              <Icon icon="cil:view-module" className="text-2xl" />{" "}
              <div>More From This Collection</div>
            </div>
            <div className="relative">
              <div className="absolute -left-2 top-0 flex h-full -translate-x-full items-center opacity-0 transition-all hover:opacity-100">
                <Button
                  ref={prevButtonRefProducts}
                  isIconOnly
                  onClick={() => swiperRefProducts.current?.swiper.slidePrev()}
                  children={
                    <Icon
                      icon="ooui:next-rtl"
                      className="text-3xl text-white"
                    />
                  }
                  className="h-40 bg-[#12121233]"
                />
              </div>
              <Swiper
                ref={swiperRefProducts}
                slidesPerView={5}
                spaceBetween={30}
                className="mySwiper px-2 py-8"
              >
                {getProduct.isLoading ? (
                  <SwiperSlide className="!w-full">
                    <LoadingCollectionList
                      quality={5}
                      wrapperClass="grid-cols-5"
                    />
                  </SwiperSlide>
                ) : (
                  getProduct.data?.productList.map((product, idx) => (
                    <SwiperSlide key={idx}>
                      <Card
                        as="div"
                        shadow="sm"
                        key={idx}
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
                                  ? handleRemoveProductFromCart(product.id)
                                  : handleAddProductToCart(
                                      user.cart.id,
                                      product.id,
                                    )
                              }}
                            />
                          </div>
                        </CardFooter>
                      </Card>
                    </SwiperSlide>
                  ))
                )}
              </Swiper>
              <div className="absolute -right-2 top-0 flex h-full translate-x-full items-center opacity-0 transition-all hover:opacity-100">
                <Button
                  ref={nextButtonRefProducts}
                  isIconOnly
                  onClick={() => {
                    swiperRefProducts.current?.swiper.slideNext()
                  }}
                  children={
                    <Icon
                      icon="ooui:next-ltr"
                      className="text-3xl text-white"
                    />
                  }
                  className="h-40 bg-[#12121233]"
                />
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
