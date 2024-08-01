import CartProduct from '#models/cartProducts'
import Collection from '#models/collection'
import Product from '#models/product'
import db from '@adonisjs/lucid/services/db'
import { GetProductListFromCartDto } from './dto/get_product_list_from_cart.dto.js'

export default class ProductService {
  async getAllProducts(data: any) {
    const { page, limit, collectionId, keyword, sort, minPrice, maxPrice, userId, sortedBy } = data

    return await Product.query()
      .where('collectionId', collectionId)
      .andWhere('isDeleted', false)
      .andWhere((builder) => {
        builder.whereRaw('LOWER(name) LIKE LOWER(?)', [`%${keyword}%`])

        if (userId) {
          builder.where('ownerByUserId', userId)
        }
        if (Number(minPrice) && Number(maxPrice)) {
          builder.where('price', '>', minPrice).andWhere('price', '<', maxPrice)
        }
        if (Number(minPrice)) {
          builder.where('price', '>', minPrice)
        }
        if (Number(maxPrice)) {
          builder.where('price', '<', maxPrice)
        }
      })

      .orderBy(sortedBy ? 'price' : sort, sortedBy ? sortedBy : 'asc')
      .paginate(page, limit)
  }

  async getProductsFromCart(data: GetProductListFromCartDto) {
    const { cartId } = data

    const cartProduct = await CartProduct.query()
      .where({
        cartId: cartId,
      })
      .preload('product', (builder) => builder.preload('collection'))
      .orderBy('createdAt', 'desc')

    return cartProduct
  }

  async getProductById(id: number) {
    const product = await Product.query()
      .where('id', id)
      .andWhere('isDeleted', false)
      .preload('collection', (builder) => builder.preload('profile').preload('category'))
      .firstOrFail()

    const productList = await Product.query()
      .where('collectionId', product.collectionId)
      .andWhere('isDeleted', false)
      .orderBy('id', 'asc')
      .limit(10)
    return { ...product.serialize(), productList }
  }

  async createProduct(data: any) {
    return await db.transaction(async (trx) => {
      const product = await Product.create(data, { client: trx })

      const collection = await Collection.findByOrFail('id', product.collectionId, { client: trx })

      if (collection.floorPrice === 0 || collection.floorPrice > product.price) {
        collection.floorPrice = product.price
      }
      collection.totalVolume += product.price * product.quantity

      await collection.save()

      await product.load('collection')

      return product
    })
  }

  async deleteProduct(id: number) {
    const product = await Product.query().where('id', id).andWhere('isDeleted', false).firstOrFail()

    product.isDeleted = true

    await product.save()
  }

  async updateProduct(id: number, data: any) {
    const product = await Product.query().where('id', id).andWhere('isDeleted', false).firstOrFail()
    product.merge(data)
    await product.save()
    return product
  }

  async getProductCreatedByUser(userId: number) {
    const result = await db.rawQuery(
      'SELECT * FROM collections WHERE created_by_user_id = ? AND is_deleted = false',
      [userId]
    )

    const collectionIds = result.rows.map((collection: any) => collection.id)
    const products = await Product.query()
      .whereIn('collectionId', collectionIds)
      .andWhere('isDeleted', false)
    return products
  }
}
