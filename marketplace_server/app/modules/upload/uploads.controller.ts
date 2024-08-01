// import type { HttpContext } from '@adonisjs/core/http'
import cloudinary from '#config/cloudinary'
import InvalidImageException from '#exceptions/invalid_image_exception'
import env from '#start/env'
import { HttpContext } from '@adonisjs/core/http'

export default class UploadsController {
  async uploadImage(ctx: HttpContext) {
    try {
      const { request, response } = ctx

      const file = request.file('image', {
        size: '2mb',
        extnames: ['jpg', 'png', 'jpeg'],
      })
      if (!file?.tmpPath) {
        throw new InvalidImageException('Please upload an image')
      }

      if (file.hasErrors) {
        throw new InvalidImageException('INVALID_IMAGE_FORMAT')
      }

      const cloudinayResponse = await cloudinary.uploader.upload(file.tmpPath, {
        folder: env.get('CLOUDINARY_FOLDER'),
        allowed_formats: ['jpg', 'png', 'jpeg'],
      })

      response.send(cloudinayResponse.url)
    } catch (err) {
      throw new InvalidImageException()
    }
  }

  async uploadMultipleImages(ctx: HttpContext) {
    const { request, response } = ctx
    const files = request.files('image', {
      size: '2mb',
      extnames: ['jpg', 'png', 'jpeg'],
    })

    if (files.length === 0) {
      return response.status(400).send({ message: 'No images uploaded.' })
    }

    try {
      const uploadPromises = files.map((file) => {
        if (!file?.tmpPath) {
          throw new InvalidImageException('Please upload an image')
        }

        if (file.hasErrors) {
          throw new InvalidImageException('INVALID_IMAGE_FORMAT')
        }

        return cloudinary.uploader.upload(file.tmpPath, {
          folder: env.get('CLOUDINARY_FOLDER'),
          allowed_formats: ['jpg', 'png', 'jpeg'],
        })
      })

      const uploadResults = await Promise.all(uploadPromises)
      const imageUrls = uploadResults.map((uploadResult) => uploadResult.url)

      response.send({ urls: imageUrls })
    } catch (err) {
      throw new InvalidImageException()
    }
  }
}
