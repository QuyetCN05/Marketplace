import Collection from '#models/collection'
import factory from '@adonisjs/lucid/factories'

export const CollectionFactory = factory
  .define(Collection, async ({ faker }) => {
    return {
      name: faker.lorem.words(3),
      description: faker.lorem.sentence(),
      isDeleted: false,
      categoryId: faker.number.int({ min: 1, max: 6 }),
      imageUrl:
        'https://i.seadn.io/s/raw/files/572cdff4974eb0952fd2a22ee6c57014.jpg?auto=format&dpr=1&w=384',
      bannerUrl:
        'https://i.seadn.io/s/primary-drops/0x6c6b9a46ccf6168a10b1f1a85cb19314659d87a6/27640784:about:media:f8a29073-0b7b-45be-b0af-e9ef0e0a380c.jpeg?auto=format&dpr=1&w=1920',
    }
  })
  .build()
