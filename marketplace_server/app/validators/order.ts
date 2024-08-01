import vine from '@vinejs/vine'

export const createOrderValidator = vine.compile(
  vine.object({
    cart_items: vine.array(
      vine.object({
        product_id: vine.number().min(1),
        quantity: vine.number().min(1),
      })
    ),
  })
)
