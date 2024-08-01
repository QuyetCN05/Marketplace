import vine from '@vinejs/vine'

export const createCollectionsValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(3).maxLength(20),
    floor_price: vine.number().min(1),
    description: vine.string().trim().minLength(3).maxLength(100),
    total_volume: vine.number().min(1),
    category_id: vine.number().min(1),
    created_by_user_id: vine.string(),
    profile_id: vine.string(),
  })
)
