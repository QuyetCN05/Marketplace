import env from '#start/env'
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: env.get('CLOUDINARY_CLOUD_NAME'),
  api_key: env.get('CLOUDINARY_API_KEY'),
  api_secret: env.get('CLOUDINARY_API_SECRET'),
})

interface UploadResult {
  status: boolean
  url: string
}

export class CloudinaryService {
  static async upload(filePath: string): Promise<UploadResult> {
    try {
      const response = await cloudinary.uploader.upload(filePath, { folder: 'test' })
      return { status: true, url: response.secure_url }
    } catch (error) {
      return { status: false, url: (error as Error).message }
    }
  }
}

export default CloudinaryService
