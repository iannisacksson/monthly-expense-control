import { Subcategory } from "../models/index"

export class SubcategoryRepository {
  async create(data: { category_id: string; name: string }) {
    return Subcategory.create(data)
  }

  async findById(id: string) {
    return Subcategory.findByPk(id)
  }

  async findByCategoryId(categoryId: string) {
    return Subcategory.findAll({ where: { category_id: categoryId } })
  }

  async update(id: string, data: Partial<{ name: string }>) {
    const subcategory = await Subcategory.findByPk(id)
    if (!subcategory) return null
    return subcategory.update(data)
  }

  async delete(id: string) {
    const subcategory = await Subcategory.findByPk(id)
    if (!subcategory) return null
    await subcategory.destroy()
    return subcategory
  }
}
