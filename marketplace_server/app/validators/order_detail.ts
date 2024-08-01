import vine from '@vinejs/vine'

export const createOrderDetailValidator = vine.compile(
  vine.object({
    order_id: vine.number().min(1),
    product_id: vine.number().min(1),
    price: vine.number().min(1),
    number_product: vine.number().min(1),
  })
)
