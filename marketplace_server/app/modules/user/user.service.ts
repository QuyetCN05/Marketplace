import DatabaseException from '#exceptions/database_exception'
import Profile from '#models/profile'
import User from '#models/user'
import { RechargeDTO } from './dto/recharge.dto.js'
import { UpdateProfileDTO } from './dto/update_profile.dto.js'

export default class UsersService {
  async getProfile(userId: number): Promise<Profile> {
    try {
      const profile = await Profile.findByOrFail('user_id', userId)
      return profile
    } catch (error) {
      throw new DatabaseException(error.message)
    }
  }

  async updateProfile(userId: number, data: UpdateProfileDTO): Promise<Profile> {
    try {
      const profile = await Profile.findByOrFail('user_id', userId)

      const newProfile = await profile.merge(data).save()

      return newProfile
    } catch (error) {
      throw new DatabaseException(error.message)
    }
  }

  async recharge(userId: number, data: RechargeDTO): Promise<User> {
    try {
      const user = await User.findByOrFail('id', userId)

      return await user
        .merge({
          walletBalance: Number(data.money) + Number(user.walletBalance),
        })
        .save()
    } catch (error) {
      throw new DatabaseException(error.message)
    }
  }
}
