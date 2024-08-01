import Category from '#models/category'

export default class CategoryService {
  async createCategory(data: any) {
    //return Category.create(data)
    return Category.createMany(data)
  }

  async getAllCatrgories() {
    return Category.query().orderBy('id', 'asc')
  }

  async getCategoryById(id: number) {
    return Category.findOrFail(id)
  }

  async updateCategory(id: number, data: any) {
    const category = await Category.findOrFail(id)
    if (!category) {
      throw new Error('Category not found')
    }
    category.merge(data)
    await category.save()
    return category
  }
}
