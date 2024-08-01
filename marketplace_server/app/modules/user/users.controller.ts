

import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import { UpdateProfileDTO } from './dto/update_profile.dto.js'
import UsersService from './user.service.js'
import CloudinaryService from '#services/CloudinaryService'

@inject()
export default class UsersController {
  constructor(private usersService: UsersService
  ) {}
  async getProfile(ctx: HttpContext) {
    const user = ctx.auth.user
    await user?.load('cart', (builder) =>
      builder.withCount('products', (query) => {
        query.as('totalProducts')
      })
    )

    const totalProducts = Number(user?.cart?.$extras.totalProducts)

    const profile = await this.usersService.getProfile(user!.id)

    ctx.response.send({
      ...user?.serialize(),
      cart: { ...user?.cart.serialize(), totalProducts },
      profile,
    })
  }

  async updateProfile(ctx: HttpContext<UpdateProfileDTO>) {
    const user = ctx.auth.user?.serialize()
    const fileAvatar = ctx.request.file('avatar')
    const fileBanner = ctx.request.file('banner')
    const updateData = {
      ...ctx.request.body()
    }
    if (fileAvatar && fileAvatar.tmpPath !== null && fileAvatar.tmpPath !== undefined) {
      const avatar = await CloudinaryService.upload(fileAvatar.tmpPath)
      updateData.avatarUrl = avatar.url
    }
    if (fileBanner && fileBanner.tmpPath !== null && fileBanner.tmpPath !== undefined) {
      const banner = await CloudinaryService.upload(fileBanner.tmpPath)
      updateData.bannerUrl = banner.url
    }
    const newProfile = await this.usersService.updateProfile(user?.id, updateData)
    ctx.response.send(newProfile)
  }

  async recharge(ctx: HttpContext) {
    const user = await this.usersService.recharge(ctx.auth.user!.id, {
      money: ctx.request.body().money,
    })

    ctx.response.send(user)
  }
}
