import Product from '#models/product'
import factory from '@adonisjs/lucid/factories'

export const ProductFactory = factory
  .define(Product, async ({ faker }): Promise<Partial<Product>> => {
    return {
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: Number(faker.commerce.price()),
      isDeleted: false,
      quantity: faker.number.int(2000), // faker.random.number(1000, 10000
      collectionId: faker.number.int({ min: 4, max: 23 }), // Randomly select collection_id from 1 to 6
      imageUrl:
        'https://i.seadn.io/s/raw/files/43445c33ca9a539dbc18f39f89c4550c.jpg?auto=format&dpr=1&w=384',
    }
  })
  .build()
