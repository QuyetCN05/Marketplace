import HttpStatusCode from '#responses/HttpStatusCode'
import { createCategoriesValidator, validateParams } from '#validators/category'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import CategoryService from './category.service.js'

@inject()
export default class CategoriesController {
  constructor(private categoryService: CategoryService) {}
  /**
   * Display a list of resource
   */
  async index({ response }: HttpContext) {
    const data = await this.categoryService.getAllCatrgories()
    response.status(HttpStatusCode.OK).send({
      message: 'List of categories',
      data: data,
    })
  }

  /**
   * Display form to create a new record
   */
  // async create({}: HttpContext) {}

  /**
   * Handle form submission for the create action
   */
  async store({ request, response }: HttpContext) {
    try {
      const payload = await createCategoriesValidator.validate(request.all())

      const data = await this.categoryService.createCategory(payload)
      response.status(HttpStatusCode.CREATED).send({
        message: 'Category created successfully',
        data: data,
      })
    } catch (error) {
      response.status(HttpStatusCode.BAD_REQUEST).send({
        message: 'INSERT CATEGORIES FAILED',
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
      const data = await this.categoryService.getCategoryById(id)

      response.status(HttpStatusCode.OK).send({
        messages: 'Success',
        data: data,
      })
    } catch (error) {
      response.status(HttpStatusCode.BAD_REQUEST).send({
        message: 'GET CATEGORY FAILED',
        error: error.messages,
      })
    }
  }

  /**
   * Edit individual record
   */
  // async edit({ params }: HttpContext) {}

  /**
   * Handle form submission for the edit action
   */
  async update({ response, params, request }: HttpContext) {
    try {
      const id = await validateParams.validate(params.id)
      const payload = await createCategoriesValidator.validate(request.all())
      const data = await this.categoryService.updateCategory(id, payload)
      response.status(HttpStatusCode.OK).send({
        message: 'Category updated successfully',
        data: data,
      })
    } catch (error) {
      response.status(HttpStatusCode.BAD_REQUEST).send({
        message: 'UPDATE CATEGORIES FAILED',
        error: error.messages,
      })
    }
  }

  /**
   * Delete record
   */
  async destroy({ response, params }: HttpContext) {
    return response.send(`Delete category with ID ${params.id}`)
  }
}
