import vine from '@vinejs/vine'

export const createProductValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(3),
    description: vine.string().trim(),
    price: vine.number().min(1),
    quantity: vine.number().min(1),
    collection_id: vine.number().min(1),
  })
)
