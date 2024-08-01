import vine from '@vinejs/vine'

export const createCategoriesValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(3).maxLength(20),
  })
)

export const validateParams = vine.compile(vine.number().min(1))
