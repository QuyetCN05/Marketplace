import InvalidImageException from '#exceptions/invalid_image_exception'
import HttpStatusCode from '#responses/HttpStatusCode'
import CloudinaryService from '#services/CloudinaryService'
import { validateParams } from '#validators/category'
import ImageValidator from '#validators/image'
import { createProductValidator } from '#validators/product'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import { errors } from '@adonisjs/lucid'
import { GetProductListDto } from './dto/get_product_list.dto.js'
import { GetProductListFromCartDto } from './dto/get_product_list_from_cart.dto.js'
import ProductService from './product.service.js'

@inject()
export default class ProductsController {
  constructor(
    private productService: ProductService,
    private imageValidator: ImageValidator
  ) {}

  /**
   * Display a list of resource
   */
  async index(ctx: HttpContext) {
    try {
      const collectionId = (ctx.request.qs() as GetProductListDto).collectionId
      if (!Number(collectionId)) {
        throw new Error()
      }

      const listProducts = await this.productService.getAllProducts({
        userId: ctx.request.qs().userId,
        collectionId,
        minPrice: ctx.request.qs().minPrice,
        maxPrice: ctx.request.qs().maxPrice,
        sortedBy: ctx.request.qs().sortedBy,
        ...ctx.pagination,
      })

      ctx.response.status(HttpStatusCode.OK).send(listProducts)
    } catch (error) {
      ctx.response.status(HttpStatusCode.BAD_REQUEST).send({
        message: 'Product not found',
      })
    }
  }

  async getProductsFromCart(ctx: HttpContext) {
    try {
      const cartId = (ctx.request.qs() as GetProductListFromCartDto).cartId
      if (!Number(cartId)) {
        throw new Error()
      }

      const listProducts = await this.productService.getProductsFromCart({
        cartId,
      })

      ctx.response.status(HttpStatusCode.OK).send({ data: listProducts })
    } catch (error) {
      ctx.response.status(HttpStatusCode.BAD_REQUEST).send({
        message: 'Product not found',
      })
    }
  }

  /**
   * Display form to create a new record
   */
  async store(ctx: HttpContext) {
    try {
      const data = await createProductValidator.validate(ctx.request.all())
      const productImage = ctx.request.file('image')

      if (!productImage || productImage.tmpPath === undefined || productImage.tmpPath === null) {
        throw new InvalidImageException()
      }

      if (
        !this.imageValidator.checkImageType(productImage) ||
        !this.imageValidator.checkImageSize(productImage)
      ) {
        throw new InvalidImageException()
      }

      const resultImage = await CloudinaryService.upload(productImage.tmpPath)
      const image_url = resultImage.url
      const produdct = await
      this.productService.createProduct({ ...data, image_url })

      ctx.response.status(HttpStatusCode.CREATED).send({
        message: 'Product created successfully',
        data: produdct,
      })
    } catch (error) {
      if (error instanceof InvalidImageException) {
        error.handle(error, ctx)
      } else {
        ctx.response.status(HttpStatusCode.BAD_REQUEST).send({
          message: 'Could not create product',
          errors: error.messages,
        })
      }
    }
  }

  /**
   * Show individual record
   */
  async show(ctx: HttpContext) {
    try {
      const id = await validateParams.validate(ctx.params.id)

      const product = await this.productService.getProductById(id)

      ctx.response.status(HttpStatusCode.OK).send({
        message: 'Successful',
        data: product,
      })
    } catch (error) {
      if (error instanceof errors.E_ROW_NOT_FOUND) {
        ctx.response.status(HttpStatusCode.BAD_REQUEST).send({
          message: 'GET PRODUCT FAILED',
          error: 'product not found',
        })
      } else {
        ctx.response.status(HttpStatusCode.BAD_REQUEST).send({
          message: 'GET PRODUCT FAILED',
        })
      }
    }
  }

  /**
   * Handle form submission for the edit action
   */
  async update(ctx: HttpContext) {
    const id = await validateParams.validate(ctx.params.id)
    // const data = await createProductValidator.validate(ctx.request.all())
    const data = ctx.request.all()
    try {
      const product = await this.productService.updateProduct(id, data)
      ctx.response.status(HttpStatusCode.OK).send({
        message: 'Product updated successfully',
        data: product,
      })
    } catch (error) {
      if (error instanceof errors.E_ROW_NOT_FOUND) {
        ctx.response.status(HttpStatusCode.BAD_REQUEST).send({
          message: 'UPDATE PRODUCT FAILED',
          error: 'Product not found',
        })
      } else {
        ctx.response.status(HttpStatusCode.BAD_REQUEST).send({
          message: 'UPDATE PRODUCT FAILED',
          error: error.messages,
        })
      }
    }
  }

  /**
   * Delete record
   */
  async destroy(ctx: HttpContext) {
    try {
      const id = await validateParams.validate(ctx.params.id)
      await this.productService.deleteProduct(id)
      ctx.response.status(HttpStatusCode.OK).send({
        message: 'Product deleted successfully',
      })
    } catch (error) {
      if (error instanceof errors.E_ROW_NOT_FOUND) {
        ctx.response.status(HttpStatusCode.BAD_REQUEST).send({
          message: 'DELETE PRODUCT FAILED',
          error: 'Product not found',
        })
      } else {
        ctx.response.status(HttpStatusCode.BAD_REQUEST).send({
          message: 'DELETE PRODUCT FAILED',
          error: error.messages,
        })
      }
    }
  }

  async uploadProductImage(ctx: HttpContext) {
    try {
      const productImage = ctx.request.file('image')

      if (!productImage || productImage.tmpPath === undefined || productImage.tmpPath === null) {
        throw new InvalidImageException()
      }

      if (!this.imageValidator.checkImageType(productImage)) {
        throw new InvalidImageException()
      }

      const resultImage = await CloudinaryService.upload(productImage.tmpPath)
      const image_url = resultImage.url

      const updatedProduct = await this.productService.updateProduct(ctx.params.id, { image_url })
      ctx.response.status(HttpStatusCode.OK).send({
        message: 'Product image uploaded successfully',
        data: updatedProduct,
      })
    } catch (error) {
      if (error instanceof InvalidImageException) {
        error.handle(error, ctx)
      } else {
        ctx.response.status(HttpStatusCode.BAD_REQUEST).send({
          message: 'Could not upload image',
        })
      }
    }
  }

  async getProductCreatedByUser(ctx: HttpContext) {
    try {
      const listProduct = await this.productService.getProductCreatedByUser(ctx.params.id)

      ctx.response.status(HttpStatusCode.OK).send({
        message: 'successful',
        products: listProduct,
      })
    } catch (error) {
      ctx.response.status(HttpStatusCode.BAD_REQUEST).send({
        message: 'Product not found',
      })
    }
  }
}
