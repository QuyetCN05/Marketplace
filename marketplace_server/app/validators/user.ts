import vine from '@vinejs/vine'

export const updateProfile = vine.compile(
  vine.object({
    username: vine.string().trim().minLength(3).maxLength(30).optional(),
    avatarUrl: vine.string().trim().url().optional(),
    bannerUrl: vine.string().trim().url().optional(),
    bio: vine.string().trim().maxLength(255).optional(),
  })
)
