import { Category } from "../models/index"

export class CategoryRepository {
  async create(data: { user_id?: string; family_id?: string; name: string; type: string }) {
    return Category.create(data)
  }

  async findById(id: string) {
    return Category.findByPk(id)
  }

  async findByUserId(userId: string) {
    return Category.findAll({ where: { user_id: userId } })
  }

  async findAll() {
    return Category.findAll()
  }

  async update(id: string, data: Partial<{ name: string; type: string }>) {
    const category = await Category.findByPk(id)
    if (!category) return null
    return category.update(data)
  }

  async delete(id: string) {
    const category = await Category.findByPk(id)
    if (!category) return null
    await category.destroy()
    return category
  }
}
