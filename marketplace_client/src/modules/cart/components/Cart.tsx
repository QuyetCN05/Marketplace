import { Icon } from "@iconify-icon/react/dist/iconify.mjs"
import {
  Avatar,
  Button,
  Input,
  Modal,
  ModalContent,
  useDisclosure,
} from "@nextui-org/react"
import clsx from "clsx"
import DialogModal from "components/common/DialogModal"
import { queryClient } from "configs/queryClient"
import { AnimatePresence, Cycle, Variants, motion } from "framer-motion"
import debounce from "lodash.debounce"
import WalletModal from "modules/user/components/WalletModal"
import { useCallback, useEffect, useState } from "react"
import { Controller, useFieldArray, useForm } from "react-hook-form"
import { toast } from "sonner"
import { useCart } from "store/cart"
import { useUser } from "store/user"
import { CartProducts } from "types/cartProducts"
import { useChangeQuantityProductFromCart } from "../services/changeQuantityProductFromCart"
import { CreateOrderRequest, useCreateOrder } from "../services/createOrder"
import { useGetProductListFromCart } from "../services/getProductListFromCart"
import { useRemoveAllProductFromCart } from "../services/removeAllProductFromCart"
import { useRemoveProductFromCart } from "../services/removeProductFromCart"

interface Props {
  open: boolean
  cycleOpen: Cycle
}

const sideVariants: Variants = {
  closed: {
    transition: {
      staggerChildren: 0.2,
      staggerDirection: -1,
    },
  },
  open: {
    transition: {
      staggerChildren: 0.2,
      staggerDirection: 1,
    },
  },
}

export default function Cart({ open, cycleOpen }: Props) {
  const { user, setUser } = useUser()
  const { setCart, cart } = useCart()

  const [order, setOrder] = useState<CreateOrderRequest>()

  const disclosureDialogPaymentConfirm = useDisclosure()
  const disclosureDialogNotification = useDisclosure()
  const disclosureWallet = useDisclosure()

  const getProductListFromCart = useGetProductListFromCart(
    user.cart.id,
    !!user.cart.id,
  )
  const removeProductFromCart = useRemoveProductFromCart()
  const removeAllProductFromCart = useRemoveAllProductFromCart()
  const changeQuantityProductFromCart = useChangeQuantityProductFromCart()
  const createOrder = useCreateOrder()

  const methods = useForm({
    defaultValues: {
      products: [] as CartProducts[],
    },
  })

  const { fields } = useFieldArray({
    control: methods.control,
    name: "products",
  })

  const debouncedQuantity = useCallback(
    debounce(
      (_index: number, productId: number, cartId: number, quantity: number) => {
        changeQuantityProductFromCart.mutate({
          quantity,
          productId,
          cartId,
        })
      },
      500,
    ),
    [],
  )

  useEffect(() => {
    debouncedQuantity.cancel()
  }, [debouncedQuantity])

  const increaseQuantity = (index: number, currentQuantity: number) => {
    methods.setValue(`products.${index}.quantity`, Number(currentQuantity) + 1)
  }

  const decreaseQuantity = (index: number, currentQuantity: number) => {
    if (Number(currentQuantity) < 2) {
      return methods.setValue(`products.${index}.quantity`, 1)
    }
    methods.setValue(`products.${index}.quantity`, Number(currentQuantity) - 1)
  }

  const totalPrice = () => {
    return (
      getProductListFromCart.data?.reduce((prevs, curr, idx) => {
        if (curr.product.price) {
          return (prevs +=
            curr.product.price * methods.watch(`products.${idx}.quantity`))
        }
        return prevs
      }, 0) || 0
    )
  }

  const handleQuantityChange = (index: number, value: string) => {
    const newQuantity = Number(value)

    if (newQuantity < 2) {
      return methods.setValue(`products.${index}.quantity`, 1)
    }

    methods.setValue(`products.${index}.quantity`, newQuantity)
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

  const handleRemoveAllProductFromCart = () => {
    removeAllProductFromCart.mutate(undefined, {
      onSuccess: () => {
        queryClient
          .refetchQueries({
            queryKey: ["getProductListFromCart"],
          })
          .then(() => {
            toast.success("Delete all product from cart successfully")
          })
      },
    })
  }

  const onSubmit = (data: { products: CartProducts[] }) => {
    setOrder({
      cart_items: data.products.map((cartproducts) => ({
        product_id: cartproducts.productId,
        quantity: cartproducts.quantity,
      })),
    })
  }

  const handleCreateOrder = (order: CreateOrderRequest) => {
    createOrder.mutate(order, {
      onSuccess: async (data) => {
        setUser({ ...user, walletBalance: data.walletBalance })
        await Promise.all([
          queryClient.refetchQueries({
            queryKey: ["getProductListFromCart"],
          }),
          queryClient.refetchQueries({
            queryKey: ["getProduct"],
          }),
        ]).then(() => {
          disclosureDialogPaymentConfirm.onClose()
          toast.success("Order Payment successfully")
        })
      },
    })
  }

  useEffect(() => {
    if (getProductListFromCart.data) {
      methods.reset({ products: getProductListFromCart.data })
      setCart({
        cartProducts: getProductListFromCart.data,
      })
    }
  }, [getProductListFromCart.data])

  return (
    <form onSubmit={methods.handleSubmit(onSubmit)}>
      <AnimatePresence>
        {open && (
          <motion.aside
            initial={{ width: 0 }}
            animate={{
              width: 384,
            }}
            exit={{
              width: 0,
              transition: { duration: 0.3 },
            }}
            onClick={() => {
              document.body.style.overflowY = "auto"
              cycleOpen()
            }}
            className={clsx(
              "fixed right-0 top-0 z-40 h-full w-full",
              "before:fixed before:left-0 before:right-0 before:h-full before:bg-[#12121233]",
            )}
          >
            <motion.div
              className="container relative flex h-full max-h-screen w-full min-w-96 flex-col overflow-hidden bg-white"
              initial="closed"
              animate="open"
              exit="closed"
              variants={sideVariants}
              color="red"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative p-5">
                <div className="text-2xl font-semibold">Your cart</div>
                <Button
                  isIconOnly
                  variant="light"
                  children={
                    <Icon icon="mingcute:close-fill" className="text-xl" />
                  }
                  className="absolute right-4 top-7 h-fit w-fit min-w-0"
                  onClick={() => {
                    document.body.style.overflowY = "auto"
                    cycleOpen()
                  }}
                />
              </div>
              {cart.cartProducts.length > 0 ? (
                <>
                  <div className="flex max-h-[80vh] flex-col items-center border-y-1 p-5 pr-2">
                    <div className="flex h-full w-full flex-1 flex-col items-center">
                      <div className="flex h-full w-full flex-col gap-5">
                        <div className="flex w-full items-center justify-between gap-5">
                          <div className="font-semibold">
                            {fields.length} item
                          </div>
                          <Button
                            color="danger"
                            variant="light"
                            onClick={() => handleRemoveAllProductFromCart()}
                            isLoading={removeAllProductFromCart.isPending}
                            className="cursor-pointer font-semibold"
                          >
                            Clear all
                          </Button>
                        </div>
                        <div className="flex h-full flex-col gap-5 overflow-y-auto pr-2 pt-2">
                          {cart.cartProducts.map((cartProduct, idx) => (
                            <div
                              key={idx}
                              className="relative flex items-center gap-5 text-sm"
                            >
                              <div className="flex items-center gap-3">
                                <Avatar
                                  isBordered
                                  radius="sm"
                                  src={cartProduct.product.imageUrl}
                                  className="h-16 w-16 min-w-16"
                                />
                                <div className="flex flex-col">
                                  <div className="line-clamp-1 font-semibold capitalize">
                                    {cartProduct.product.name}
                                  </div>
                                  <div className="line-clamp-2 capitalize">
                                    {cartProduct.product.collection.name} by{" "}
                                    {user.profile.username}
                                  </div>
                                </div>
                              </div>
                              <div className="flex min-w-28 flex-col items-center gap-1">
                                <div>
                                  {(
                                    cartProduct.product.price *
                                    methods.watch(`products.${idx}.quantity`)
                                  ).toLocaleString("de-DE")}{" "}
                                  USD
                                </div>
                                <Controller
                                  control={methods.control}
                                  name={`products.${idx}.quantity`}
                                  render={({ field }) => (
                                    <Input
                                      {...field}
                                      size="sm"
                                      type="number"
                                      variant="bordered"
                                      color="secondary"
                                      className="max-w-44"
                                      classNames={{
                                        input: "text-center",
                                      }}
                                      defaultValue={cartProduct.quantity.toString()}
                                      value={methods
                                        .watch(`products.${idx}.quantity`)
                                        .toString()}
                                      onChange={(e) => {
                                        handleQuantityChange(
                                          idx,
                                          e.target.value,
                                        )
                                        if (
                                          Number(e.target.value) <
                                          cartProduct.product.quantity
                                        ) {
                                          debouncedQuantity(
                                            idx,
                                            cartProduct.productId,
                                            cartProduct.cartId,
                                            Number(e.target.value),
                                          )
                                        }
                                      }}
                                      isInvalid={
                                        field.value >
                                        cartProduct.product.quantity
                                      }
                                      errorMessage="Quantity exceeds stock"
                                      startContent={
                                        <button className="flex items-center">
                                          <Icon
                                            icon="ic:round-minus"
                                            className="cursor-pointer text-xl"
                                            onClick={() => {
                                              decreaseQuantity(idx, field.value)
                                              debouncedQuantity(
                                                idx,
                                                cartProduct.productId,
                                                cartProduct.cartId,
                                                field.value,
                                              )
                                            }}
                                          />
                                        </button>
                                      }
                                      endContent={
                                        <button className="flex items-center">
                                          <Icon
                                            icon="ic:round-plus"
                                            className="cursor-pointer text-xl"
                                            onClick={() => {
                                              increaseQuantity(idx, field.value)
                                              debouncedQuantity(
                                                idx,
                                                cartProduct.productId,
                                                cartProduct.cartId,
                                                field.value,
                                              )
                                            }}
                                          />
                                        </button>
                                      }
                                    />
                                  )}
                                />

                                <button
                                  onClick={() =>
                                    handleRemoveProductFromCart(
                                      cartProduct.productId,
                                    )
                                  }
                                  className="absolute -top-2 right-0 z-10"
                                >
                                  <Icon
                                    icon="mingcute:close-fill"
                                    className="text-primary"
                                  />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between gap-5 p-5">
                    <div className="font-semibold">Total price</div>
                    <div className="min-w-28 text-center font-semibold">
                      {totalPrice().toLocaleString("de-DE")} USD
                    </div>
                  </div>
                  <div className="px-5 pb-10">
                    <Button
                      type="submit"
                      size="lg"
                      color="secondary"
                      className="w-full"
                      onPress={disclosureDialogPaymentConfirm.onOpen}
                    >
                      Complete purchase
                    </Button>
                  </div>
                </>
              ) : (
                <div className="flex min-h-32 w-full items-center justify-center text-default-500">
                  Add items to get started.
                </div>
              )}
            </motion.div>
          </motion.aside>
        )}
      </AnimatePresence>

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
                textHeader="Confirm Order Payment"
                body={
                  <span>
                    Are you sure you want to{" "}
                    <strong>Confirm Order Payment</strong> from your cart?
                  </span>
                }
                btnAcceptProps={{
                  color: "secondary",
                  children: "Confirm",
                  isLoading: createOrder.isPending,
                  onClick: () => {
                    if (order) {
                      if (user.walletBalance < totalPrice()) {
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
    </form>
  )
}
