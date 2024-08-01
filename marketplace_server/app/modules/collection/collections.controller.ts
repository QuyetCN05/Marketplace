import InvalidImageException from '#exceptions/invalid_image_exception'
import HttpStatusCode from '#responses/HttpStatusCode'
import CloudinaryService from '#services/CloudinaryService'
import { validateParams } from '#validators/category'
import { createCollectionsValidator } from '#validators/collection'
import ImageValidator from '#validators/image'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import { errors } from '@adonisjs/lucid'
import CollectionsService from './collection.service.js'

@inject()
export default class CollectionsController {
  constructor(
    private collectionService: CollectionsService,
    private imageValidator: ImageValidator
  ) {}
  /**
   * Display a list of resource
   */
  async index(ctx: HttpContext) {
    try {
      const data = await this.collectionService.getAllCollections({
        categoryId: ctx.request.qs().categoryId,
        ...ctx.pagination,
      })
      ctx.response.status(HttpStatusCode.OK).send(data)
    } catch (error) {
      if (error instanceof errors.E_ROW_NOT_FOUND) {
        ctx.response.status(HttpStatusCode.NOT_FOUND).send({
          message: 'GET COLLECTIONS FAILED',
          error: 'Collections not found',
        })
      }
    }
  }

  /**
   * Handle form submission for the create action
   */
  async getTopCollections(ctx: HttpContext) {
    try {
      const data = await this.collectionService.getTopCollections({
        categoryId: ctx.request.qs().categoryId,
        sortedBy: ctx.request.qs().sortedBy,
        ...ctx.pagination,
      })

      return ctx.response.status(HttpStatusCode.OK).send({
        message: 'List of top collections',
        data: data,
      })
    } catch (error) {
      if (error instanceof errors.E_ROW_NOT_FOUND) {
        ctx.response.status(HttpStatusCode.NOT_FOUND).send({
          message: 'GET COLLECTIONS FAILED',
          error: 'Collections not found',
        })
      }
    }
  }

  async store({ request, response }: HttpContext) {
    try {
      const fileBanner = request.file('banner')
      const fileImage = request.file('images')

      if (
        !fileImage ||
        fileImage.tmpPath === null ||
        fileImage.tmpPath === undefined ||
        !fileBanner ||
        fileBanner.tmpPath === null ||
        fileBanner.tmpPath === undefined
      ) {
        throw new InvalidImageException('Invalid file path')
      }
      if (
        !this.imageValidator.checkImageType(fileImage) ||
        !this.imageValidator.checkImageType(fileBanner) ||
        !this.imageValidator.checkImageSize(fileImage) ||
        !this.imageValidator.checkImageSize(fileBanner)
      ) {
        throw new InvalidImageException('Invalid file type')
      }

      const resultImage = await CloudinaryService.upload(fileImage.tmpPath)
      const resultBanner = await CloudinaryService.upload(fileBanner.tmpPath)
      const payload = await createCollectionsValidator.validate(request.all())

      const data = await this.collectionService.createCollection({
        ...payload,
        created_by_user_id: Number(payload.created_by_user_id),
        profile_id: Number(payload.profile_id),
        image_url: resultImage.url,
        banner_url: resultBanner.url,
      })

      response.status(HttpStatusCode.CREATED).send({
        messages: 'Collection created successfully',
        data: data,
      })
    } catch (error) {
      console.log(error)

      response.status(HttpStatusCode.BAD_REQUEST).send({
        messages: 'INSERT COLLECTIONS FAILED',
        error: error.messages,
      })
    }
  }
  /**
   * Show individual record
   */
  async show({ params, response }: HttpContext) {
    try {
      const id = await validateParams.validate(params.id)

      const data = await this.collectionService.getCollectionById(id)

      response.status(HttpStatusCode.OK).send({
        messages: 'Success',
        data: data,
      })
    } catch (error) {
      if (error instanceof errors.E_ROW_NOT_FOUND) {
        response.status(HttpStatusCode.BAD_REQUEST).send({
          message: 'GET COLLECTION FAILED',
          error: 'Collection not found',
        })
      }
    }
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request, response }: HttpContext) {
    const id = await validateParams.validate(params.id)
    const data = request.all()

    try {
      const collection = await this.collectionService.updateCollection(id, data)
      response.status(HttpStatusCode.OK).send({
        message: 'Collection updated successfully',
        data: collection,
      })
    } catch (error) {
      if (error instanceof errors.E_ROW_NOT_FOUND) {
        response.status(HttpStatusCode.NOT_FOUND).send({
          message: 'UPDATE COLLECTION FAILED',
          error: 'Collection not found',
        })
      } else {
        response.status(HttpStatusCode.BAD_REQUEST).send({
          message: 'UPDATE COLLECTION FAILED',
          error: error.messages,
        })
      }
    }
  }

  /**
   * Delete record
   */
  async destroy({ params, response }: HttpContext) {
    try {
      const id = await validateParams.validate(params.id)
      await this.collectionService.deleteCollection(id)
      response.status(HttpStatusCode.OK).send({
        message: 'Collection deleted successfully',
      })
    } catch (error) {
      if (error instanceof errors.E_ROW_NOT_FOUND) {
        response.status(HttpStatusCode.NOT_FOUND).send({
          message: 'DELETE COLLECTION FAILED',
          error: 'Collection not found',
        })
      } else {
        response.status(HttpStatusCode.BAD_REQUEST).send({
          message: 'DELETE COLLECTION FAILED',
          error: error.messages,
        })
      }
    }
  }

  async uploadCollectionImage({ params, request, response }: HttpContext) {
    try {
      const fileBanner = request.file('banner')
      const fileImage = request.file('images')

      if (
        !fileImage ||
        fileImage.tmpPath === null ||
        fileImage.tmpPath === undefined ||
        !fileBanner ||
        fileBanner.tmpPath === null ||
        fileBanner.tmpPath === undefined
      ) {
        throw new InvalidImageException('Invalid file path')
      }
      if (
        !this.imageValidator.checkImageType(fileImage) ||
        !this.imageValidator.checkImageType(fileBanner)
      ) {
        throw new InvalidImageException('Invalid file type')
      }

      const resultImage = await CloudinaryService.upload(fileImage.tmpPath)
      const resultBanner = await CloudinaryService.upload(fileBanner.tmpPath)
      const updatedCollection = await this.collectionService.updateCollection(params.id, {
        image_url: resultImage.url,
        banner_url: resultBanner.url,
      })
      response.status(HttpStatusCode.OK).send({
        message: 'Collection image updated successfully',
        data: updatedCollection,
      })
    } catch (error) {
      if (error instanceof InvalidImageException) {
        response.status(HttpStatusCode.BAD_REQUEST).send({
          message: 'UPDATE COLLECTION IMAGE FAILED',
          error: error.message,
        })
      } else {
        response.status(HttpStatusCode.BAD_REQUEST).send({
          message: 'UPDATE COLLECTION IMAGE FAILED',
        })
      }
    }
  }
  async getInforUser(ctx: HttpContext) {
    try {
      const data = await this.collectionService.getUser(ctx.params.id)
      ctx.response.status(200).send({
        data: data,
      })
    } catch (error) {
      ctx.response.status(HttpStatusCode.NOT_FOUND).send({
        message: 'GET USER FAILED',
      })
    }
  }

  async getCollectionByUserId(ctx: HttpContext) {
    try {
      const listCollections = await this.collectionService.getCollectionByUserId(ctx.params.id)

      ctx.response.status(HttpStatusCode.OK).send({
        message: 'Success',
        collections: listCollections,
      })
    } catch (error) {
      ctx.response.status(HttpStatusCode.NOT_FOUND).send({
        message: 'Collections not found',
      })
    }
  }
  async deleteCollectionByUser(ctx: HttpContext) {
    try {
      await this.collectionService.deleteCollectionByUser(ctx.params.userId, ctx.params.id)
      ctx.response.status(HttpStatusCode.OK).send({
        message: 'Deleted successfully',
      })
    } catch (error) {
      ctx.response.status(HttpStatusCode.NOT_FOUND).send({
        message: 'Delete failed',
      })
    }
  }
}
