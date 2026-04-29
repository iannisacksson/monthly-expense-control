import { SubcategoryRepository } from "../repositories/subcategory.repository"
import { CategoryRepository } from "../repositories/category.repository"
import { CreateSubcategoryDTO, UpdateSubcategoryDTO } from "../dtos/subcategory.dto"

const subcategoryRepository = new SubcategoryRepository()
const categoryRepository = new CategoryRepository()

export class SubcategoryService {
  async createSubcategory(data: CreateSubcategoryDTO) {
    const name = data.name?.trim()

    if (!name || name.length < 2 || name.length > 100) {
      throw new Error("Subcategory name must be between 2 and 100 characters")
    }

    const category = await categoryRepository.findById(data.category_id)
    if (!category) {
      throw new Error("Category not found")
    }

    return subcategoryRepository.create({
      ...data,
      name,
    })
  }

  async findSubcategoryById(id: string) {
    const subcategory = await subcategoryRepository.findById(id)
    if (!subcategory) {
      throw new Error("Subcategory not found")
    }
    return subcategory
  }

  async listSubcategoriesByCategory(categoryId: string) {
    return subcategoryRepository.findByCategoryId(categoryId)
  }

  async updateSubcategory(id: string, data: UpdateSubcategoryDTO) {
    const normalizedName = data.name?.trim()

    if (data.name !== undefined && (!normalizedName || normalizedName.length < 2 || normalizedName.length > 100)) {
      throw new Error("Subcategory name must be between 2 and 100 characters")
    }

    const subcategory = await subcategoryRepository.update(id, {
      ...data,
      name: normalizedName,
    })
    if (!subcategory) {
      throw new Error("Subcategory not found")
    }
    return subcategory
  }

  async deleteSubcategory(id: string) {
    const subcategory = await subcategoryRepository.delete(id)
    if (!subcategory) {
      throw new Error("Subcategory not found")
    }
    return subcategory
  }
}
